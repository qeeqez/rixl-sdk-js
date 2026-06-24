import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  updateFullName,
  updateUsername,
  getOTPStatus,
  setupUserOTP,
  verifyUserOTP,
  deleteUserOTP,
} from "../auth/user";
import { setupAuthTest, cleanupAuthMocks } from "./utils/auth-test-helpers";

const mockPatchAuthV1UsersCurrentName = vi.fn();
const mockPatchAuthV1UsersCurrentUsername = vi.fn();
const mockGetAuthV1UsersCurrentTotpStatus = vi.fn();
const mockPostAuthV1UsersCurrentTotpSetup = vi.fn();
const mockPostAuthV1UsersCurrentTotpVerify = vi.fn();
const mockDeleteAuthV1UsersCurrentTotpDelete = vi.fn();

vi.mock("../generated/sdk.gen", () => ({
  patchAuthV1UsersCurrentName: (...args: unknown[]) => mockPatchAuthV1UsersCurrentName(...args),
  patchAuthV1UsersCurrentUsername: (...args: unknown[]) =>
    mockPatchAuthV1UsersCurrentUsername(...args),
  getAuthV1UsersCurrentTotpStatus: (...args: unknown[]) =>
    mockGetAuthV1UsersCurrentTotpStatus(...args),
  postAuthV1UsersCurrentTotpSetup: (...args: unknown[]) =>
    mockPostAuthV1UsersCurrentTotpSetup(...args),
  postAuthV1UsersCurrentTotpVerify: (...args: unknown[]) =>
    mockPostAuthV1UsersCurrentTotpVerify(...args),
  deleteAuthV1UsersCurrentTotpDelete: (...args: unknown[]) =>
    mockDeleteAuthV1UsersCurrentTotpDelete(...args),
}));

describe("User Management", () => {
  let mocks: ReturnType<typeof setupAuthTest>;

  beforeEach(() => {
    mocks = setupAuthTest();
    mockPatchAuthV1UsersCurrentName.mockReset();
    mockPatchAuthV1UsersCurrentUsername.mockReset();
    mockGetAuthV1UsersCurrentTotpStatus.mockReset();
    mockPostAuthV1UsersCurrentTotpSetup.mockReset();
    mockPostAuthV1UsersCurrentTotpVerify.mockReset();
    mockDeleteAuthV1UsersCurrentTotpDelete.mockReset();
  });

  afterEach(() => {
    cleanupAuthMocks(mocks);
  });

  describe("updateFullName", () => {
    it("should update name successfully", async () => {
      mockPatchAuthV1UsersCurrentName.mockResolvedValue({
        data: { first_name: "John", last_name: "Doe" },
      });

      await updateFullName("John Doe");

      expect(mockPatchAuthV1UsersCurrentName).toHaveBeenCalledWith({
        body: { full_name: "John Doe" },
        throwOnError: true,
      });
    });

    it("should not attempt token refresh (response has no tokens)", async () => {
      mockPatchAuthV1UsersCurrentName.mockResolvedValue({
        data: { first_name: "Jane", last_name: "Smith" },
      });

      await updateFullName("Jane Smith");

      expect(mocks.setTokensSpy).not.toHaveBeenCalled();
    });

    it("should validate name format", async () => {
      await expect(updateFullName("")).rejects.toThrow();
    });

    it("should throw error for rate limiting", async () => {
      mockPatchAuthV1UsersCurrentName.mockRejectedValue({
        error: "too_many_requests",
        code: 429,
      });

      await expect(updateFullName("Valid Name")).rejects.toThrow();
    });
  });

  describe("updateUsername", () => {
    it("should update username successfully", async () => {
      mockPatchAuthV1UsersCurrentUsername.mockResolvedValue({
        data: { username: "newusername" },
      });

      await updateUsername("newusername");

      expect(mockPatchAuthV1UsersCurrentUsername).toHaveBeenCalledWith({
        body: { username: "newusername" },
        throwOnError: true,
      });
    });

    it("should not attempt token refresh (response has no tokens)", async () => {
      mockPatchAuthV1UsersCurrentUsername.mockResolvedValue({
        data: { username: "another_user" },
      });

      await updateUsername("another_user");

      expect(mocks.setTokensSpy).not.toHaveBeenCalled();
    });

    it("should validate username format", async () => {
      await expect(updateUsername("ab")).rejects.toThrow();
    });

    it("should throw error for conflict", async () => {
      mockPatchAuthV1UsersCurrentUsername.mockRejectedValue({
        error: "conflict",
        code: 409,
      });

      await expect(updateUsername("taken_user")).rejects.toThrow();
    });
  });

  describe("getOTPStatus", () => {
    it("should return OTP status", async () => {
      mockGetAuthV1UsersCurrentTotpStatus.mockResolvedValue({
        data: {
          is_setup: true,
          created_at: "2024-01-01",
          message: "OTP is enabled",
        },
      });

      const result = await getOTPStatus();

      expect(result).toEqual({
        is_setup: true,
        created_at: "2024-01-01",
        message: "OTP is enabled",
      });
      expect(mockGetAuthV1UsersCurrentTotpStatus).toHaveBeenCalledWith({
        throwOnError: true,
      });
    });

    it("should handle disabled OTP status", async () => {
      mockGetAuthV1UsersCurrentTotpStatus.mockResolvedValue({
        data: {
          is_setup: false,
          message: "OTP not enabled",
        },
      });

      const result = await getOTPStatus();

      expect(result.is_setup).toBe(false);
    });
  });

  describe("setupUserOTP", () => {
    it("should return QR code and secret", async () => {
      mockPostAuthV1UsersCurrentTotpSetup.mockResolvedValue({
        data: {
          qr_code_url: "https://example.com/qr.png",
          secret: "JBSWY3DPEHPK3PXP",
        },
      });

      const result = await setupUserOTP();

      expect(result).toEqual({
        qrCodeUrl: "https://example.com/qr.png",
        secret: "JBSWY3DPEHPK3PXP",
      });
      expect(mockPostAuthV1UsersCurrentTotpSetup).toHaveBeenCalledWith({
        throwOnError: true,
      });
    });
  });

  describe("verifyUserOTP", () => {
    it("should verify OTP and set tokens", async () => {
      mockPostAuthV1UsersCurrentTotpVerify.mockResolvedValue({
        data: {
          access_token: "new-token",
          refresh_token: "new-refresh",
          expires_in: 3600,
        },
      });

      await verifyUserOTP("123456");

      expect(mockPostAuthV1UsersCurrentTotpVerify).toHaveBeenCalledWith({
        body: { code: "123456" },
        throwOnError: true,
      });
      expect(mocks.setTokensSpy).toHaveBeenCalledWith("new-token", "new-refresh", 3600);
    });

    it("should validate OTP code format", async () => {
      await expect(verifyUserOTP("")).rejects.toThrow();
    });

    it("should reject non-numeric codes", async () => {
      await expect(verifyUserOTP("abcdef")).rejects.toThrow();
    });
  });

  describe("deleteUserOTP", () => {
    it("should delete OTP successfully", async () => {
      mockDeleteAuthV1UsersCurrentTotpDelete.mockResolvedValue({
        data: { message: "OTP deleted" },
      });

      await expect(deleteUserOTP()).resolves.toBeUndefined();

      expect(mockDeleteAuthV1UsersCurrentTotpDelete).toHaveBeenCalledWith({
        throwOnError: true,
      });
    });

    it("should throw error for unauthorized", async () => {
      mockDeleteAuthV1UsersCurrentTotpDelete.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(deleteUserOTP()).rejects.toThrow();
    });
  });
});
