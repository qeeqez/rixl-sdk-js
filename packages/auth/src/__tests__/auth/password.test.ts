/**
 * Password management tests
 * Tests: sendPasswordResetEmail, confirmPasswordReset
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { sendPasswordResetEmail, confirmPasswordReset } from "@/auth/password";
import { HTTP_STATUS } from "@/constants.ts";
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

describe("Password Functions", () => {
  let mocks: ReturnType<typeof setupAuthTest>;

  beforeEach(() => {
    mocks = setupAuthTest();
  });

  afterEach(() => {
    cleanupAuthMocks(mocks);
  });

  describe("sendPasswordResetEmail", () => {
    it("should send password reset email", async () => {
      mockPublicFetch.mockResolvedValue(undefined);

      await sendPasswordResetEmail("test@example.com");

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/password/reset", {
        method: "POST",
        body: { email: "test@example.com" },
      });
    });

    it("should throw error for invalid email", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Bad Request", {
          status: HTTP_STATUS.BAD_REQUEST,
          endpoint: "auth/password/reset",
        }),
      );

      await expect(sendPasswordResetEmail("invalid@example.com")).rejects.toThrow(
        "Bad request - invalid email or validation error",
      );
    });
  });

  describe("confirmPasswordReset", () => {
    it("should confirm password reset successfully", async () => {
      mockPublicFetch.mockResolvedValue(undefined);

      await confirmPasswordReset("reset-token-123", "NewPassword123");

      expect(mockPublicFetch).toHaveBeenCalledWith("auth/password/reset/confirm", {
        method: "POST",
        body: { token: "reset-token-123", new_password: "NewPassword123" },
      });
    });

    it("should throw error for invalid token or password", async () => {
      mockPublicFetch.mockRejectedValue(
        new ApiError("Bad Request", {
          status: HTTP_STATUS.BAD_REQUEST,
          endpoint: "auth/password/reset/confirm",
        }),
      );

      await expect(confirmPasswordReset("invalid-token", "NewPass123")).rejects.toThrow(
        "Bad request - invalid token or password",
      );
    });
  });
});
