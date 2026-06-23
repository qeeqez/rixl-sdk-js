import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loginWithEmail, verifyTOTPForLogin } from "@/auth";
import { createMockJWT } from "../utils/test-helpers";
import { setupAuthTest, cleanupAuthMocks } from "../utils/auth-test-helpers";

const mockPostAuthV1Login = vi.fn();
const mockPostAuthV1VerifyTotp = vi.fn();

vi.mock("@rixl/sdk", () => ({
  postAuthV1Login: (...args: unknown[]) => mockPostAuthV1Login(...args),
  postAuthV1VerifyTotp: (...args: unknown[]) => mockPostAuthV1VerifyTotp(...args),
}));

describe("Login Functions", () => {
  let mocks: ReturnType<typeof setupAuthTest>;

  beforeEach(() => {
    mocks = setupAuthTest();
    mockPostAuthV1Login.mockReset();
    mockPostAuthV1VerifyTotp.mockReset();
  });

  afterEach(() => {
    cleanupAuthMocks(mocks);
  });

  describe("loginWithEmail", () => {
    it("should login successfully with valid credentials", async () => {
      const mockToken = createMockJWT();
      mockPostAuthV1Login.mockResolvedValue({
        data: {
          status: "ok",
          tokens: { access_token: mockToken, refresh_token: "refresh-123", expires_in: 3600 },
        },
      });

      await loginWithEmail("test@example.com", "Password123");

      expect(mockPostAuthV1Login).toHaveBeenCalledWith({
        body: { email: "test@example.com", password: "Password123" },
        throwOnError: true,
      });
      expect(mocks.setTokensSpy).toHaveBeenCalledWith(mockToken, "refresh-123", 3600);
    });

    it("should return OTP response when 2FA is required", async () => {
      mockPostAuthV1Login.mockResolvedValue({
        data: {
          status: "otp_required",
          session_id: "session-123",
        },
      });

      const result = await loginWithEmail("test@example.com", "Password123");

      expect(result).toEqual({
        message: "OTP verification required",
        session_id: "session-123",
        totp_required: true,
      });
      expect(mocks.setTokensSpy).not.toHaveBeenCalled();
    });

    it("should handle incorrect credentials error", async () => {
      mockPostAuthV1Login.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(loginWithEmail("test@example.com", "ValidPass123")).rejects.toThrow();
    });

    it("should handle bad request error", async () => {
      mockPostAuthV1Login.mockRejectedValue({
        error: "bad_request",
        code: 400,
      });

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
      mockPostAuthV1Login.mockRejectedValue(new Error("Network error"));

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
      const mockToken = createMockJWT();
      mockPostAuthV1Login.mockResolvedValue({
        data: {
          status: "ok",
          tokens: { access_token: mockToken, refresh_token: "refresh", expires_in: 3600 },
        },
      });

      await loginWithEmail("test+special@example.com", "Password123");

      expect(mockPostAuthV1Login).toHaveBeenCalledWith({
        body: { email: "test+special@example.com", password: "Password123" },
        throwOnError: true,
      });
    });

    it("should return LoginErrorResponse for email not verified", async () => {
      mockPostAuthV1Login.mockResolvedValue({
        data: {
          status: "email_not_verified",
          email: "test@example.com",
        },
      });

      const result = await loginWithEmail("test@example.com", "Password123");

      expect(result).toEqual({
        error_code: "email_not_verified",
        message: "Email not verified",
        email: "test@example.com",
      });
      expect(mocks.setTokensSpy).not.toHaveBeenCalled();
    });

    it("should return LoginErrorResponse for provider conflict", async () => {
      mockPostAuthV1Login.mockRejectedValue({
        error: "provider_conflict",
        details: "This email is already registered with Google",
        code: 409,
      });

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
      mockPostAuthV1VerifyTotp.mockResolvedValue({
        data: {
          access_token: mockToken,
          refresh_token: "refresh-123",
          expires_in: 3600,
        },
      });

      await verifyTOTPForLogin("123456", "session-123");

      expect(mockPostAuthV1VerifyTotp).toHaveBeenCalledWith({
        body: { code: "123456", session_id: "session-123" },
        throwOnError: true,
      });
      expect(mocks.setTokensSpy).toHaveBeenCalledWith(mockToken, "refresh-123", 3600);
    });

    it("should throw error for invalid code format", async () => {
      await expect(verifyTOTPForLogin("abc", "session-123")).rejects.toThrow();
    });

    it("should throw error for session not found", async () => {
      mockPostAuthV1VerifyTotp.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(verifyTOTPForLogin("123456", "invalid-session")).rejects.toThrow();
    });
  });
});
