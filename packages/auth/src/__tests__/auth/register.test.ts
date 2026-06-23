/**
 * Registration functionality tests
 * Tests: registerWithEmail, resendEmailVerificationCode
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { registerWithEmail, resendEmailVerificationCode } from "@/auth/register";
import { HTTP_STATUS } from "@/constants";
import { mockPublicFetch, ApiError } from "../setup/api-mocks";
import { setupAuthTest, cleanupAuthMocks } from "../utils/auth-test-helpers";

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

describe("Registration Functions", () => {
  let mocks: ReturnType<typeof setupAuthTest>;

  beforeEach(() => {
    mocks = setupAuthTest();
  });

  afterEach(() => {
    cleanupAuthMocks(mocks);
  });

  describe("registerWithEmail", () => {
    it("should register user successfully", async () => {
      mockPublicFetch.mockResolvedValue({
        verification_id: "verify-123",
        message: "Registration successful",
      });

      const result = await registerWithEmail("newuser@example.com", "Password123");

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/register", {
        method: "POST",
        body: { email: "newuser@example.com", password: "Password123" },
      });
      expect(result).toEqual({
        verification_id: "verify-123",
        message: "Registration successful",
      });
    });

    it("includes subscribe_to_blog: true when opted in", async () => {
      mockPublicFetch.mockResolvedValue({
        verification_id: "verify-123",
        message: "Registration successful",
      });

      await registerWithEmail("newuser@example.com", "Password123", true);

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/register", {
        method: "POST",
        body: { email: "newuser@example.com", password: "Password123", subscribe_to_blog: true },
      });
    });

    it("includes subscribe_to_blog: false when opted out", async () => {
      mockPublicFetch.mockResolvedValue({
        verification_id: "verify-123",
        message: "Registration successful",
      });

      await registerWithEmail("newuser@example.com", "Password123", false);

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/register", {
        method: "POST",
        body: { email: "newuser@example.com", password: "Password123", subscribe_to_blog: false },
      });
    });

    it("omits subscribe_to_blog when not provided", async () => {
      mockPublicFetch.mockResolvedValue({
        verification_id: "verify-123",
        message: "Registration successful",
      });

      await registerWithEmail("newuser@example.com", "Password123");

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/register", {
        method: "POST",
        body: { email: "newuser@example.com", password: "Password123" },
      });
    });

    it("should throw error when email already exists", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Conflict", HTTP_STATUS.CONFLICT, "auth/register"),
      );

      await expect(registerWithEmail("existing@example.com", "Password123")).rejects.toThrow(
        "Email address is already registered",
      );
    });

    it("should handle short password error", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Bad Request", HTTP_STATUS.BAD_REQUEST, "auth/register"),
      );

      await expect(registerWithEmail("test@example.com", "ValidPass123")).rejects.toThrow();
    });
  });

  describe("resendEmailVerificationCode", () => {
    it("should resend verification code successfully", async () => {
      mockPublicFetch.mockResolvedValue({
        verification_id: "verify-456",
        message: "Code resent",
      });

      await resendEmailVerificationCode("test@example.com");

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/email/verify/resend", {
        method: "POST",
        body: { email: "test@example.com" },
      });
    });

    it("should throw error for user not found", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Not Found", HTTP_STATUS.NOT_FOUND, "auth/email/verify/resend"),
      );

      await expect(resendEmailVerificationCode("notfound@example.com")).rejects.toThrow(
        "User not found with the provided email",
      );
    });

    it("should throw error for rate limit exceeded", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError(
          "Too Many Requests",
          HTTP_STATUS.TOO_MANY_REQUESTS,
          "auth/email/verify/resend",
        ),
      );

      await expect(resendEmailVerificationCode("test@example.com")).rejects.toThrow(
        "Too many requests - rate limit exceeded",
      );
    });
  });
});
