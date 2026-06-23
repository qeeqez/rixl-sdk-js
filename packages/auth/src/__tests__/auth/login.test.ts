/**
 * Login functionality tests
 * Tests: loginWithEmail, verifyTOTPForLogin
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loginWithEmail, verifyTOTPForLogin } from "@/auth";
import { HTTP_STATUS } from "@/constants.ts";
import { mockPublicFetch, ApiError } from "../setup/api-mocks";
import { createMockJWT } from "../utils/test-helpers";
import { setupAuthTest, cleanupAuthMocks } from "../utils/auth-test-helpers";

// Create mock using factory pattern - eliminates 33 lines of duplication!
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

describe("Login Functions", () => {
  let mocks: ReturnType<typeof setupAuthTest>;

  beforeEach(() => {
    mocks = setupAuthTest();
  });

  afterEach(() => {
    cleanupAuthMocks(mocks);
  });

  describe("loginWithEmail", () => {
    it("should login successfully with valid credentials", async () => {
      const mockToken = createMockJWT();
      mockPublicFetch.mockResolvedValue({
        access_token: mockToken,
        refresh_token: "refresh-123",
        expires_in: 3600,
      });

      await loginWithEmail("test@example.com", "Password123");

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/login", {
        method: "POST",
        body: { email: "test@example.com", password: "Password123" },
      });
      expect(mocks.setTokensSpy).toHaveBeenCalledWith(mockToken, "refresh-123", 3600);
    });

    it("should return OTP response when 2FA is required", async () => {
      mockPublicFetch.mockResolvedValue({
        session_id: "session-123",
        requires_verification: true,
      });

      const result = await loginWithEmail("test@example.com", "Password123");

      expect(result).toEqual({
        session_id: "session-123",
        requires_verification: true,
      });
      expect(mocks.setTokensSpy).not.toHaveBeenCalled();
    });

    it("should handle incorrect credentials error", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Unauthorized", { status: HTTP_STATUS.UNAUTHORIZED, endpoint: "auth/login" }),
      );

      await expect(loginWithEmail("test@example.com", "ValidPass123")).rejects.toThrow();
    });

    it("should handle bad request error", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Bad Request", { status: HTTP_STATUS.BAD_REQUEST, endpoint: "auth/login" }),
      );

      await expect(loginWithEmail("test@example.com", "ValidPass123")).rejects.toThrow();
    });

    it("should validate email format", async () => {
      await expect(loginWithEmail("invalid-email", "Password123")).rejects.toThrow();
    });

    it("should validate password requirements", async () => {
      await expect(loginWithEmail("test@example.com", "short")).rejects.toThrow();
      await expect(loginWithEmail("test@example.com", "nouppercase123")).rejects.toThrow();
    });

    it("should handle network errors gracefully", async () => {
      mockPublicFetch.mockRejectedValue(new Error("Network error"));

      await expect(loginWithEmail("test@example.com", "Password123")).rejects.toThrow(
        "Network error",
      );
    });

    it("should validate empty email", async () => {
      await expect(loginWithEmail("", "Password123")).rejects.toThrow();
    });

    it("should validate empty password", async () => {
      await expect(loginWithEmail("test@example.com", "")).rejects.toThrow();
    });

    it("should handle special characters in email", async () => {
      mockPublicFetch.mockResolvedValue({
        access_token: createMockJWT(),
        refresh_token: "refresh",
        expires_in: 3600,
      });

      await loginWithEmail("test+special@example.com", "Password123");

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/login", {
        method: "POST",
        body: { email: "test+special@example.com", password: "Password123" },
      });
    });

    it("should return LoginErrorResponse for email not verified (403)", async () => {
      const error = new ApiError("Email not verified", {
        status: HTTP_STATUS.FORBIDDEN,
        endpoint: "auth/login",
      });
      error.data = { error: "email_not_verified", error_description: "Email not verified" };
      mockPublicFetch.mockRejectedValue(error);

      const result = await loginWithEmail("test@example.com", "Password123");

      expect(result).toEqual({
        error_code: "email_not_verified",
        message: "Email not verified",
        email: "test@example.com",
      });
      expect(mocks.setTokensSpy).not.toHaveBeenCalled();
    });

    it("should return LoginErrorResponse for provider conflict (409)", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("This email is already registered with Google", {
          status: HTTP_STATUS.CONFLICT,
          endpoint: "auth/login",
        }),
      );

      const result = await loginWithEmail("test@example.com", "Password123");

      expect(result).toEqual({
        error_code: "provider_conflict",
        message: "This email is already registered with Google",
        email: "test@example.com",
      });
      expect(mocks.setTokensSpy).not.toHaveBeenCalled();
    });
  });

  describe("verifyTOTPForLogin", () => {
    it("should verify TOTP and set tokens", async () => {
      const mockToken = createMockJWT();
      mockPublicFetch.mockResolvedValue({
        access_token: mockToken,
        refresh_token: "refresh-123",
        expires_in: 3600,
      });

      await verifyTOTPForLogin("123456", "session-123");

      expect(mockPublicFetch).toHaveBeenCalledWith("verify-totp", {
        method: "POST",
        body: { code: "123456", session_id: "session-123" },
      });
      expect(mocks.setTokensSpy).toHaveBeenCalledWith(mockToken, "refresh-123", 3600);
    });

    it("should throw error for invalid code format", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Bad Request", { status: HTTP_STATUS.BAD_REQUEST, endpoint: "verify-totp" }),
      );

      await expect(verifyTOTPForLogin("12345", "session-123")).rejects.toThrow(
        "Bad request - Invalid code format, invalid code, or invalid session",
      );
    });

    it("should throw error for session not found", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Not Found", { status: HTTP_STATUS.NOT_FOUND, endpoint: "verify-totp" }),
      );

      await expect(verifyTOTPForLogin("123456", "invalid-session")).rejects.toThrow(
        "Session not found",
      );
    });
  });
});
