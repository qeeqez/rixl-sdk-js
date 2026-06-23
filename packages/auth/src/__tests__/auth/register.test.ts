import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { registerWithEmail, resendEmailVerificationCode } from "@/auth/register";
import { setupAuthTest, cleanupAuthMocks } from "../utils/auth-test-helpers";

const mockPostAuthV1Register = vi.fn();
const mockPostAuthV1EmailVerifyResend = vi.fn();

vi.mock("@rixl/sdk", () => ({
  postAuthV1Register: (...args: unknown[]) => mockPostAuthV1Register(...args),
  postAuthV1EmailVerifyResend: (...args: unknown[]) => mockPostAuthV1EmailVerifyResend(...args),
}));

describe("Registration Functions", () => {
  let mocks: ReturnType<typeof setupAuthTest>;

  beforeEach(() => {
    mocks = setupAuthTest();
    mockPostAuthV1Register.mockReset();
    mockPostAuthV1EmailVerifyResend.mockReset();
  });

  afterEach(() => {
    cleanupAuthMocks(mocks);
  });

  describe("registerWithEmail", () => {
    it("should register user successfully", async () => {
      mockPostAuthV1Register.mockResolvedValue({
        data: {
          verification_id: "verify-123",
          message: "Registration successful",
        },
      });

      const result = await registerWithEmail("newuser@example.com", "Password123");

      expect(mockPostAuthV1Register).toHaveBeenCalledWith({
        body: { email: "newuser@example.com", password: "Password123" },
        throwOnError: true,
      });
      expect(result).toEqual({
        verification_id: "verify-123",
        message: "Registration successful",
      });
    });

    it("includes subscribe_to_blog: true when opted in", async () => {
      mockPostAuthV1Register.mockResolvedValue({
        data: {
          verification_id: "verify-123",
          message: "Registration successful",
        },
      });

      await registerWithEmail("newuser@example.com", "Password123", true);

      expect(mockPostAuthV1Register).toHaveBeenCalledWith({
        body: { email: "newuser@example.com", password: "Password123", subscribe_to_blog: true },
        throwOnError: true,
      });
    });

    it("includes subscribe_to_blog: false when opted out", async () => {
      mockPostAuthV1Register.mockResolvedValue({
        data: {
          verification_id: "verify-123",
          message: "Registration successful",
        },
      });

      await registerWithEmail("newuser@example.com", "Password123", false);

      expect(mockPostAuthV1Register).toHaveBeenCalledWith({
        body: { email: "newuser@example.com", password: "Password123", subscribe_to_blog: false },
        throwOnError: true,
      });
    });

    it("omits subscribe_to_blog when not provided", async () => {
      mockPostAuthV1Register.mockResolvedValue({
        data: {
          verification_id: "verify-123",
          message: "Registration successful",
        },
      });

      await registerWithEmail("newuser@example.com", "Password123");

      expect(mockPostAuthV1Register).toHaveBeenCalledWith({
        body: { email: "newuser@example.com", password: "Password123" },
        throwOnError: true,
      });
    });

    it("should throw error when email already exists", async () => {
      mockPostAuthV1Register.mockRejectedValue({
        error: "conflict",
        code: 409,
      });

      await expect(registerWithEmail("existing@example.com", "Password123")).rejects.toThrow();
    });

    it("should handle short password error", async () => {
      mockPostAuthV1Register.mockRejectedValue({
        error: "bad_request",
        code: 400,
      });

      await expect(registerWithEmail("test@example.com", "ValidPass123")).rejects.toThrow();
    });

    it("should validate email format", async () => {
      await expect(registerWithEmail("invalid-email", "Password123")).rejects.toThrow();
    });

    it("should validate password requirements", async () => {
      await expect(registerWithEmail("test@example.com", "short")).rejects.toThrow();
    });
  });

  describe("resendEmailVerificationCode", () => {
    it("should resend verification code successfully", async () => {
      mockPostAuthV1EmailVerifyResend.mockResolvedValue({
        data: {
          verification_id: "verify-456",
          message: "Code resent",
        },
      });

      const result = await resendEmailVerificationCode("test@example.com");

      expect(mockPostAuthV1EmailVerifyResend).toHaveBeenCalledWith({
        body: { email: "test@example.com" },
        throwOnError: true,
      });
      expect(result).toEqual({
        verification_id: "verify-456",
        message: "Code resent",
      });
    });

    it("should throw error for user not found", async () => {
      mockPostAuthV1EmailVerifyResend.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(resendEmailVerificationCode("notfound@example.com")).rejects.toThrow();
    });

    it("should throw error for rate limit exceeded", async () => {
      mockPostAuthV1EmailVerifyResend.mockRejectedValue({
        error: "too_many_requests",
        code: 429,
      });

      await expect(resendEmailVerificationCode("test@example.com")).rejects.toThrow();
    });

    it("should validate email format", async () => {
      await expect(resendEmailVerificationCode("invalid-email")).rejects.toThrow();
    });
  });
});
