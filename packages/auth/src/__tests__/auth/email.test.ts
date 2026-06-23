/**
 * Email management tests
 * Tests: initiateEmailChange, verifyEmailWithCode, getEmailVerificationStatus
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  initiateEmailChange,
  verifyEmailWithCode,
  getEmailVerificationStatus,
  addEmail,
} from "@/auth/email";
import * as authStore from "@/authStore";
import { HTTP_STATUS } from "@/constants.ts";
import { mockPublicFetch, mockAuthenticatedFetch, ApiError } from "../setup/api-mocks";
import { setupAuthTest, cleanupAuthMocks } from "../utils/auth-test-helpers";
import { createMockJWT } from "../utils/test-helpers";

// Mock implementation
vi.mock("../../api/fetchers", async () => {
  const { mockPublicFetch, mockAuthenticatedFetch } = await import("../setup/api-mocks");
  return {
    publicFetch: mockPublicFetch,
    authenticatedFetch: mockAuthenticatedFetch,
  };
});

vi.mock("../../api/error-handlers", async () => {
  const { mockHandleApiError, ApiError } = await import("../setup/api-mocks");
  return {
    handleApiError: mockHandleApiError,
    ApiError,
  };
});

describe("Email Functions", () => {
  let mocks: ReturnType<typeof setupAuthTest>;

  beforeEach(() => {
    mocks = setupAuthTest();
  });

  afterEach(() => {
    cleanupAuthMocks(mocks);
  });

  describe("initiateEmailChange", () => {
    it("should initiate email change successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue({
        verification_id: "verify-789",
        message: "Email change initiated",
      });

      await initiateEmailChange("newemail@example.com");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith("auth/email/change", authStore.getToken, {
        method: "POST",
        body: { new_email: "newemail@example.com" },
      });
    });

    it("should throw error when email already in use", async () => {
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Bad Request", {
          status: HTTP_STATUS.BAD_REQUEST,
          endpoint: "auth/email/change",
        }),
      );

      await expect(initiateEmailChange("existing@example.com")).rejects.toThrow(
        "Invalid email or email already in use",
      );
    });

    it("should throw error for unauthorized user", async () => {
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", {
          status: HTTP_STATUS.UNAUTHORIZED,
          endpoint: "auth/email/change",
        }),
      );

      await expect(initiateEmailChange("test@example.com")).rejects.toThrow(
        "Unauthorized - invalid or missing token",
      );
    });
  });

  describe("verifyEmailWithCode", () => {
    it("should verify email with code successfully", async () => {
      mockPublicFetch.mockResolvedValue({
        email: "test@example.com",
        message: "Email verified",
        verified: true,
      });

      await verifyEmailWithCode("123456", "email_change", "verify-123", "test@example.com");

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/email/verify", {
        method: "POST",
        body: {
          code: "123456",
          type: "email_change",
          verification_id: "verify-123",
          new_email: "test@example.com",
        },
      });
    });

    it("should set tokens when returned in response", async () => {
      const mockToken = createMockJWT();
      mockPublicFetch.mockResolvedValue({
        email: "test@example.com",
        message: "Email verified",
        verified: true,
        tokens: {
          access_token: mockToken,
          refresh_token: "refresh-123",
          expires_in: 3600,
        },
      });

      await verifyEmailWithCode("123456", "verification", "verify-123", "test@example.com");

      expect(mocks.setTokensSpy).toHaveBeenCalledWith(mockToken, "refresh-123", 3600);
    });

    it("should not set tokens when not returned in response", async () => {
      mockPublicFetch.mockResolvedValue({
        email: "test@example.com",
        message: "Email verified",
        verified: true,
      });

      await verifyEmailWithCode("123456", "email_change", "verify-123", "test@example.com");

      expect(mocks.setTokensSpy).not.toHaveBeenCalled();
    });

    it("should throw error for invalid code", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Bad Request", {
          status: HTTP_STATUS.BAD_REQUEST,
          endpoint: "auth/email/verify",
        }),
      );

      await expect(
        verifyEmailWithCode("000000", "email_change", "verify-123", "test@example.com"),
      ).rejects.toThrow("Invalid code or verification ID");
    });
  });

  describe("addEmail", () => {
    it("should add email successfully", async () => {
      mockPublicFetch.mockResolvedValue({
        verification_id: "verify-123",
        message: "Verification email sent",
      });

      const result = await addEmail("newemail@example.com");

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/email/add", {
        method: "POST",
        body: { email: "newemail@example.com" },
      });
      expect(result).toEqual({
        verification_id: "verify-123",
        message: "Verification email sent",
      });
    });

    it("should throw error for invalid email format", async () => {
      // Validation happens before API call
      await expect(addEmail("invalid-email")).rejects.toThrow("Please enter a valid email address");
    });

    it("should throw error for bad request from API", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Bad Request", {
          status: HTTP_STATUS.BAD_REQUEST,
          endpoint: "auth/email/add",
        }),
      );

      await expect(addEmail("test@example.com")).rejects.toThrow("Invalid email address");
    });

    it("should throw error when email already in use", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Conflict", { status: HTTP_STATUS.CONFLICT, endpoint: "auth/email/add" }),
      );

      await expect(addEmail("existing@example.com")).rejects.toThrow(
        "Email address is already in use",
      );
    });

    it("should throw error for rate limit exceeded", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Too Many Requests", {
          status: HTTP_STATUS.TOO_MANY_REQUESTS,
          endpoint: "auth/email/add",
        }),
      );

      await expect(addEmail("test@example.com")).rejects.toThrow(
        "Too many requests - please try again later",
      );
    });
  });

  describe("getEmailVerificationStatus", () => {
    it("should get email verification status successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue({
        verified: true,
        email: "test@example.com",
      });

      const result = await getEmailVerificationStatus();

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith("auth/email/status", authStore.getToken, {
        method: "GET",
      });
      expect(result).toEqual({ verified: true, email: "test@example.com" });
    });

    it("should throw error for unauthorized user", async () => {
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", {
          status: HTTP_STATUS.UNAUTHORIZED,
          endpoint: "auth/email/status",
        }),
      );

      await expect(getEmailVerificationStatus()).rejects.toThrow(
        "Unauthorized - invalid or missing token",
      );
    });
  });
});
