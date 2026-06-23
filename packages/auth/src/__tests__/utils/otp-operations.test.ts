/**
 * OTP operations tests
 * Tests: performOTPOperation for GET, POST, DELETE operations
 */

import { describe, it, expect, vi } from "vitest";
import { performOTPOperation } from "@/utils/otpOperations.ts";
import { authenticatedFetch } from "../../api/fetchers";
import * as authStore from "@/authStore";
import { HTTP_STATUS } from "@/constants.ts";
import { createApiError, useEntityUpdateTest } from "./entity-update-test-helpers";

vi.mock("../../api/fetchers", () => ({
  authenticatedFetch: vi.fn(),
}));

vi.mock("../../api/types", () => ({
  ApiError: class ApiError extends Error {
    constructor(
      public message: string,
      public status: number,
      public endpoint: string,
      public data?: any,
    ) {
      super(message);
      this.name = "ApiError";
    }
  },
}));

import { testTokenRefreshBehavior } from "./token-refresh-test-helper";

describe("OTP Operations", () => {
  const ENDPOINT_TOTP = "users/current/totp";
  const ENDPOINT_SETUP = "users/current/totp/setup";
  const mockAuthenticatedFetch = authenticatedFetch as any;
  const mocks = useEntityUpdateTest(authStore);

  describe("GET operations", () => {
    it("should perform GET operation successfully", async () => {
      const mockResponse = {
        enabled: true,
        backup_codes: ["123456", "234567"],
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await performOTPOperation({
        endpoint: ENDPOINT_TOTP,
        method: "GET",
      });

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(ENDPOINT_TOTP, authStore.getToken, {
        method: "GET",
        body: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle no OTP found with custom handler", async () => {
      mockAuthenticatedFetch.mockRejectedValue(createApiError(HTTP_STATUS.ACCEPTED, ENDPOINT_TOTP));

      const result = await performOTPOperation({
        endpoint: ENDPOINT_TOTP,
        method: "GET",
        handleNoOTP: (message) => ({ found: false, message }),
      });

      expect(result).toEqual({ found: false, message: "No OTP setup found" });
    });
  });

  describe("POST operations", () => {
    it("should perform POST operation with body", async () => {
      const mockResponse = {
        secret: "JBSWY3DPEHPK3PXP",
        qr_code: "data:image/png;base64,abc123",
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await performOTPOperation({
        endpoint: ENDPOINT_SETUP,
        method: "POST",
        body: { code: "123456" },
      });

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(ENDPOINT_SETUP, authStore.getToken, {
        method: "POST",
        body: { code: "123456" },
      });
      expect(result).toEqual(mockResponse);
    });

    // Reuse shared refresh behavior test for POST context
    // We wrap it in a describe to provide specific context
    describe("Token Refresh in POST", () => {
      testTokenRefreshBehavior(
        (handleTokenRefresh) =>
          performOTPOperation({
            endpoint: "users/current/totp/verify",
            method: "POST",
            body: { code: "123456" },
            handleTokenRefresh,
          }),
        mockAuthenticatedFetch,
        () => mocks.mockSetTokens,
      );
    });
  });

  describe("DELETE operations", () => {
    it("should perform DELETE operation successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await performOTPOperation({
        endpoint: ENDPOINT_TOTP,
        method: "DELETE",
      });

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(ENDPOINT_TOTP, authStore.getToken, {
        method: "DELETE",
        body: undefined,
      });
    });

    describe("Token Refresh in DELETE", () => {
      testTokenRefreshBehavior(
        (handleTokenRefresh) =>
          performOTPOperation({
            endpoint: ENDPOINT_TOTP,
            method: "DELETE",
            handleTokenRefresh,
          }),
        mockAuthenticatedFetch,
        () => mocks.mockSetTokens,
      );
    });
  });

  describe("Error handling", () => {
    const errorCases = [
      {
        desc: "bad request",
        status: HTTP_STATUS.BAD_REQUEST,
        msg: "Invalid request format",
        method: "POST",
        body: { code: "invalid" },
      },
      {
        desc: "unauthorized",
        status: HTTP_STATUS.UNAUTHORIZED,
        msg: "Token is missing or invalid; user is not authenticated.",
        method: "GET",
      },
      {
        desc: "forbidden",
        status: HTTP_STATUS.FORBIDDEN,
        msg: "User exists but is not active (not allowed to access OTP status)",
        method: "GET",
      },
      {
        desc: "not found",
        status: HTTP_STATUS.NOT_FOUND,
        msg: "User record does not exist.",
        method: "GET",
      },
      {
        desc: "rate limit",
        status: HTTP_STATUS.TOO_MANY_REQUESTS,
        msg: "User is sending too many requests.",
        method: "POST",
      },
    ];

    it.each(errorCases)("should throw error for $desc", async ({ status, msg, method, body }) => {
      mockAuthenticatedFetch.mockRejectedValue(createApiError(status, ENDPOINT_TOTP));

      await expect(
        performOTPOperation({
          endpoint: ENDPOINT_TOTP,
          method: method as any,
          body,
        }),
      ).rejects.toThrow(msg);
    });
  });

  describe("Edge cases", () => {
    it("should handle 202 status without custom handler", async () => {
      mockAuthenticatedFetch.mockRejectedValue(createApiError(HTTP_STATUS.ACCEPTED, ENDPOINT_TOTP));

      await expect(
        performOTPOperation({
          endpoint: ENDPOINT_TOTP,
          method: "GET",
        }),
      ).rejects.toThrow();
    });

    testTokenRefreshBehavior(
      (handleTokenRefresh) =>
        performOTPOperation({
          endpoint: ENDPOINT_TOTP,
          method: "GET",
          handleTokenRefresh,
        }),
      mockAuthenticatedFetch,
      () => mocks.mockSetTokens,
    );

    it("should handle missing token fields in refresh", async () => {
      mockAuthenticatedFetch.mockResolvedValue({
        access_token: "new-token",
        // Missing refresh_token and expires_in
      });

      await performOTPOperation({
        endpoint: ENDPOINT_TOTP,
        method: "POST",
        handleTokenRefresh: true,
      });

      expect(mocks.mockSetTokens).not.toHaveBeenCalled();
    });

    it("should handle complex body objects", async () => {
      mockAuthenticatedFetch.mockResolvedValue({ success: true });

      await performOTPOperation({
        endpoint: ENDPOINT_TOTP,
        method: "POST",
        body: {
          code: "123456",
          nested: { field: "value" },
          array: [1, 2, 3],
        },
      });

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Function),
        expect.objectContaining({
          body: {
            code: "123456",
            nested: { field: "value" },
            array: [1, 2, 3],
          },
        }),
      );
    });
  });
});
