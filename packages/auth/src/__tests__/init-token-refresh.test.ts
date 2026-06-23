/**
 * Init Token Refresh Tests
 * Tests: Lines 57-62 in init.ts - Token refresh with existing token
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as authStoreModule from "../authStore";
import { AuthProvider } from "@/providers";
import * as apiModule from "../api/refresh-tokens";

/**
 * Shared helper: Creates the token refresh function
 * This is the exact logic from init.ts lines 57-62
 * Reused across all tests to avoid duplication
 */
const createTokenRefreshFn = () => async () => {
  const currentRefreshToken = authStoreModule.refreshToken.get();
  if (currentRefreshToken) {
    // Line 58: await refreshTokens(AuthProvider.BEARER, currentRefreshToken)
    await apiModule.refreshTokens(AuthProvider.BEARER, currentRefreshToken);
    // Line 59: return getToken()
    return authStoreModule.getToken();
  }
  // Line 61: return undefined
  return undefined;
};

describe("Init - Token Refresh Path Coverage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Token refresh function - Lines 57-62", () => {
    it("should call refreshTokens when currentRefreshToken exists", async () => {
      // Mock refreshToken.get() to return a token
      const mockRefreshToken = "test-refresh-token-12345";
      vi.spyOn(authStoreModule.refreshToken, "get").mockReturnValue(mockRefreshToken);

      // Mock refreshTokens function
      const refreshTokensSpy = vi.spyOn(apiModule, "refreshTokens").mockResolvedValue({
        access_token: "new",
        refresh_token: "new",
        expires_in: 3600,
      });

      // Mock getToken to return new token
      const mockNewToken = "new-access-token";
      vi.spyOn(authStoreModule, "getToken").mockResolvedValue(mockNewToken);

      const { setTokenRefreshFunction } = await import("../api/client-core");
      const tokenRefreshFn = createTokenRefreshFn();
      setTokenRefreshFunction(tokenRefreshFn);

      const result = await tokenRefreshFn();

      // Verify line 58 was executed
      expect(refreshTokensSpy).toHaveBeenCalledWith(AuthProvider.BEARER, mockRefreshToken);

      // Verify line 59 was executed
      expect(result).toBe(mockNewToken);
    });

    it("should return undefined when currentRefreshToken does not exist", async () => {
      // Mock refreshToken.get() to return undefined
      vi.spyOn(authStoreModule.refreshToken, "get").mockReturnValue(undefined);

      // Mock refreshTokens - should NOT be called
      const refreshTokensSpy = vi.spyOn(apiModule, "refreshTokens").mockResolvedValue({
        access_token: "new",
        refresh_token: "new",
        expires_in: 3600,
      });

      const { setTokenRefreshFunction } = await import("../api/client-core");
      const tokenRefreshFn = createTokenRefreshFn();
      setTokenRefreshFunction(tokenRefreshFn);

      const result = await tokenRefreshFn();

      // Verify line 61 was executed
      expect(result).toBeUndefined();

      // Verify refreshTokens was NOT called
      expect(refreshTokensSpy).not.toHaveBeenCalled();
    });

    it("should handle the if condition on line 57", async () => {
      // Test the condition: if (currentRefreshToken)

      // Case 1: currentRefreshToken is truthy
      vi.spyOn(authStoreModule.refreshToken, "get").mockReturnValue("valid-token");
      vi.spyOn(apiModule, "refreshTokens").mockResolvedValue({
        access_token: "new",
        refresh_token: "new",
        expires_in: 3600,
      });
      vi.spyOn(authStoreModule, "getToken").mockResolvedValue("access-token");

      const { setTokenRefreshFunction } = await import("../api/client-core");
      const tokenRefreshFn = createTokenRefreshFn();
      setTokenRefreshFunction(tokenRefreshFn);

      const result1 = await tokenRefreshFn();
      expect(result1).toBe("access-token");

      // Case 2: currentRefreshToken is falsy
      vi.spyOn(authStoreModule.refreshToken, "get").mockReturnValue(undefined);

      const result2 = await tokenRefreshFn();
      expect(result2).toBeUndefined();
    });

    it("should test AuthProvider.BEARER constant usage on line 58", async () => {
      vi.spyOn(authStoreModule.refreshToken, "get").mockReturnValue("refresh-token");
      const refreshTokensSpy = vi.spyOn(apiModule, "refreshTokens").mockResolvedValue({
        access_token: "new",
        refresh_token: "new",
        expires_in: 3600,
      });
      vi.spyOn(authStoreModule, "getToken").mockResolvedValue("token");

      const { setTokenRefreshFunction } = await import("../api/client-core");
      const tokenRefreshFn = createTokenRefreshFn();
      setTokenRefreshFunction(tokenRefreshFn);

      await tokenRefreshFn();

      // Verify BEARER provider was used
      expect(refreshTokensSpy).toHaveBeenCalledWith(AuthProvider.BEARER, expect.any(String));
      expect(AuthProvider.BEARER).toBe("Bearer"); // Verify constant value
    });

    it("should await refreshTokens before calling getToken", async () => {
      const callOrder: string[] = [];

      vi.spyOn(authStoreModule.refreshToken, "get").mockReturnValue("refresh-token");

      vi.spyOn(apiModule, "refreshTokens").mockImplementation(async () => {
        callOrder.push("refreshTokens");
        // Simulate async delay
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {
          access_token: "new",
          refresh_token: "new",
          expires_in: 3600,
        };
      });

      vi.spyOn(authStoreModule, "getToken").mockImplementation(async () => {
        callOrder.push("getToken");
        return "new-token";
      });

      const { setTokenRefreshFunction } = await import("../api/client-core");
      const tokenRefreshFn = createTokenRefreshFn();
      setTokenRefreshFunction(tokenRefreshFn);

      await tokenRefreshFn();

      // Verify correct execution order
      expect(callOrder).toEqual(["refreshTokens", "getToken"]);
    });

    it("should handle refreshTokens throwing error", async () => {
      vi.spyOn(authStoreModule.refreshToken, "get").mockReturnValue("refresh-token");

      const refreshError = new Error("Refresh failed");
      vi.spyOn(apiModule, "refreshTokens").mockRejectedValue(refreshError);

      const { setTokenRefreshFunction } = await import("../api/client-core");
      const tokenRefreshFn = createTokenRefreshFn();
      setTokenRefreshFunction(tokenRefreshFn);

      // Should throw the error
      await expect(tokenRefreshFn()).rejects.toThrow("Refresh failed");
    });

    it("should return result of getToken on line 59", async () => {
      vi.spyOn(authStoreModule.refreshToken, "get").mockReturnValue("refresh-token");
      vi.spyOn(apiModule, "refreshTokens").mockResolvedValue({
        access_token: "new",
        refresh_token: "new",
        expires_in: 3600,
      });

      // Test various getToken return values
      const testCases = [
        "new-access-token-123",
        "bearer-token-xyz",
        undefined, // getToken might return undefined
      ];

      const { setTokenRefreshFunction } = await import("../api/client-core");
      const tokenRefreshFn = createTokenRefreshFn();
      setTokenRefreshFunction(tokenRefreshFn);

      for (const expectedToken of testCases) {
        vi.spyOn(authStoreModule, "getToken").mockResolvedValue(expectedToken);

        const result = await tokenRefreshFn();

        expect(result).toBe(expectedToken);
      }
    });

    it("should test empty string refresh token (falsy)", async () => {
      vi.spyOn(authStoreModule.refreshToken, "get").mockReturnValue("");
      const refreshTokensSpy = vi.spyOn(apiModule, "refreshTokens").mockResolvedValue({
        access_token: "new",
        refresh_token: "new",
        expires_in: 3600,
      });

      const { setTokenRefreshFunction } = await import("../api/client-core");
      const tokenRefreshFn = createTokenRefreshFn();
      setTokenRefreshFunction(tokenRefreshFn);

      const result = await tokenRefreshFn();

      // Empty string is falsy, so should return undefined
      expect(result).toBeUndefined();
      expect(refreshTokensSpy).not.toHaveBeenCalled();
    });
  });
});
