/**
 * User management tests
 * Tests: updateFullName, updateUsername, OTP functions
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  updateFullName,
  updateUsername,
  getOTPStatus,
  setupUserOTP,
  verifyUserOTP,
  deleteUserOTP,
} from "../user";

vi.mock("../utils/nameUpdates", () => ({
  updateEntityField: vi.fn(),
}));

vi.mock("../utils/otpOperations", () => ({
  performOTPOperation: vi.fn(),
}));

describe("User Management", () => {
  let mockUpdateEntityField: any;
  let mockPerformOTPOperation: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const nameUpdatesModule = await import("../utils/nameUpdates");
    const otpOperationsModule = await import("../utils/otpOperations");
    mockUpdateEntityField = nameUpdatesModule.updateEntityField;
    mockPerformOTPOperation = otpOperationsModule.performOTPOperation;
  });

  describe("updateFullName", () => {
    it("should call updateEntityField with correct parameters", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await updateFullName("John Doe");

      expect(mockUpdateEntityField).toHaveBeenCalledWith({
        value: "John Doe",
        type: "name",
        endpoint: "users/current/name",
        handleTokenRefresh: true,
      });
    });

    it("should handle token refresh", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await updateFullName("Jane Smith");

      expect(mockUpdateEntityField).toHaveBeenCalledWith(
        expect.objectContaining({
          handleTokenRefresh: true,
        }),
      );
    });

    it("should pass through errors", async () => {
      const error = new Error("Name update failed");
      mockUpdateEntityField.mockRejectedValue(error);

      await expect(updateFullName("Test User")).rejects.toThrow("Name update failed");
    });
  });

  describe("updateUsername", () => {
    it("should call updateEntityField with correct parameters", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await updateUsername("newusername");

      expect(mockUpdateEntityField).toHaveBeenCalledWith({
        value: "newusername",
        type: "username",
        endpoint: "users/current/username",
        handleTokenRefresh: true,
      });
    });

    it("should handle token refresh", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await updateUsername("another_user");

      expect(mockUpdateEntityField).toHaveBeenCalledWith(
        expect.objectContaining({
          handleTokenRefresh: true,
        }),
      );
    });

    it("should pass through errors", async () => {
      const error = new Error("Username already exists");
      mockUpdateEntityField.mockRejectedValue(error);

      await expect(updateUsername("duplicate")).rejects.toThrow("Username already exists");
    });
  });

  describe("getOTPStatus", () => {
    it("should call performOTPOperation with correct parameters", async () => {
      const mockStatus = {
        is_setup: true,
        created_at: "2024-01-01",
        message: "OTP is enabled",
      };
      mockPerformOTPOperation.mockResolvedValue(mockStatus);

      const result = await getOTPStatus();

      expect(result).toEqual(mockStatus);
      expect(mockPerformOTPOperation).toHaveBeenCalledWith({
        endpoint: "users/current/totp/status",
        method: "GET",
        handleNoOTP: expect.any(Function),
      });
    });

    it("should handle disabled OTP status", async () => {
      const mockStatus = {
        is_setup: false,
        created_at: "",
        message: "OTP not enabled",
      };
      mockPerformOTPOperation.mockResolvedValue(mockStatus);

      const result = await getOTPStatus();

      expect(result.is_setup).toBe(false);
    });

    it("should handle handleNoOTP callback", async () => {
      mockPerformOTPOperation.mockImplementation(async (config: any) => {
        return config.handleNoOTP("OTP not configured");
      });

      const result = await getOTPStatus();

      expect(result).toEqual({
        is_setup: false,
        message: "OTP not configured",
        created_at: undefined,
      });
    });
  });

  describe("setupUserOTP", () => {
    it("should call performOTPOperation with correct parameters", async () => {
      const mockSetup = {
        qrCodeUrl: "data:image/png;base64,abc123",
        secret: "JBSWY3DPEHPK3PXP",
      };
      mockPerformOTPOperation.mockResolvedValue(mockSetup);

      const result = await setupUserOTP();

      expect(result).toEqual(mockSetup);
      expect(mockPerformOTPOperation).toHaveBeenCalledWith({
        endpoint: "users/current/totp/setup",
        method: "POST",
      });
    });

    it("should return QR code and secret", async () => {
      const mockSetup = {
        qrCodeUrl: "https://example.com/qr.png",
        secret: "TESTSECRET123",
      };
      mockPerformOTPOperation.mockResolvedValue(mockSetup);

      const result = await setupUserOTP();

      expect(result.qrCodeUrl).toBe("https://example.com/qr.png");
      expect(result.secret).toBe("TESTSECRET123");
    });
  });

  describe("verifyUserOTP", () => {
    it("should call performOTPOperation with correct parameters", async () => {
      mockPerformOTPOperation.mockResolvedValue(undefined);

      await verifyUserOTP("123456");

      expect(mockPerformOTPOperation).toHaveBeenCalledWith({
        endpoint: "users/current/totp/verify",
        method: "POST",
        body: { code: "123456" },
        handleTokenRefresh: true,
      });
    });

    it("should handle token refresh", async () => {
      mockPerformOTPOperation.mockResolvedValue(undefined);

      await verifyUserOTP("654321");

      expect(mockPerformOTPOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          handleTokenRefresh: true,
        }),
      );
    });

    it("should validate OTP code format", async () => {
      mockPerformOTPOperation.mockResolvedValue(undefined);

      await expect(verifyUserOTP("")).rejects.toThrow();
    });
  });

  describe("deleteUserOTP", () => {
    it("should call performOTPOperation with correct parameters", async () => {
      mockPerformOTPOperation.mockResolvedValue(undefined);

      await deleteUserOTP();

      expect(mockPerformOTPOperation).toHaveBeenCalledWith({
        endpoint: "users/current/totp/delete",
        method: "DELETE",
      });
    });

    it("should complete successfully", async () => {
      mockPerformOTPOperation.mockResolvedValue(undefined);

      await expect(deleteUserOTP()).resolves.toBeUndefined();
    });

    it("should pass through errors", async () => {
      const error = new Error("Failed to delete OTP");
      mockPerformOTPOperation.mockRejectedValue(error);

      await expect(deleteUserOTP()).rejects.toThrow("Failed to delete OTP");
    });
  });
});
