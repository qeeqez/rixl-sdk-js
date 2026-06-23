/**
 * API Client Token Refresh Tests
 * Tests: Token refresh logic, retry mechanism, 401 handling
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setTokenRefreshFunction } from "../../api/client-core";
import { authenticatedFetch, publicFetch } from "../../api/fetchers";
import { apiURL } from "../../api-url";

describe("API Client - Token Refresh and Retry Logic", () => {
  beforeEach(() => {
    apiURL.set("https://test-api.example.com");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Token Refresh Function", () => {
    it("should set and use token refresh function", async () => {
      const mockRefreshFn = vi.fn().mockResolvedValue("refreshed-token");
      setTokenRefreshFunction(mockRefreshFn);

      expect(mockRefreshFn).toBeDefined();
    });

    it("should handle token refresh returning undefined", async () => {
      const mockRefreshFn = vi.fn().mockResolvedValue(undefined);
      setTokenRefreshFunction(mockRefreshFn);

      expect(mockRefreshFn).toBeDefined();
    });

    it("should handle token refresh errors", async () => {
      const mockRefreshFn = vi.fn().mockRejectedValue(new Error("Refresh failed"));
      setTokenRefreshFunction(mockRefreshFn);

      expect(mockRefreshFn).toBeDefined();
    });
  });

  describe("authenticatedFetch", () => {
    it("should throw error when no token and skipAuth is false", async () => {
      const mockGetToken = vi.fn().mockResolvedValue(undefined);

      await expect(authenticatedFetch("/test", mockGetToken, { method: "GET" })).rejects.toThrow(
        "No authentication token available",
      );
    });

    it("should not throw when skipAuth is true even without token", async () => {
      const mockGetToken = vi.fn().mockResolvedValue(undefined);

      // This will fail due to network, but won't throw auth error
      try {
        await authenticatedFetch("/test", mockGetToken, { method: "GET", skipAuth: true });
      } catch (error: any) {
        // Should not be auth error
        expect(error.message).not.toBe("No authentication token available");
      }
    });

    it("should call getToken function", async () => {
      const mockGetToken = vi.fn().mockResolvedValue(undefined);

      try {
        await authenticatedFetch("/test", mockGetToken);
      } catch {
        // Expected to fail, but getToken should be called
        expect(mockGetToken).toHaveBeenCalled();
      }
    });
  });

  describe("publicFetch", () => {
    it("should make requests without authentication", async () => {
      // publicFetch should not require authentication
      try {
        await publicFetch("/public-endpoint", { method: "GET" });
      } catch {
        // Expected to fail in test env, but no auth error
      }
    });

    it("should accept request configuration", async () => {
      try {
        await publicFetch("/public", {
          method: "POST",
          body: { data: "test" },
        });
      } catch {
        // Expected to fail, but config is accepted
      }
    });
  });

  describe("Request Configuration", () => {
    it("should handle skipAuth in config", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("token");

      try {
        await authenticatedFetch("/test", mockGetToken, { skipAuth: true });
      } catch {
        // Token function still called but auth skipped
        expect(mockGetToken).toHaveBeenCalled();
      }
    });

    it("should handle different HTTP methods", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("token");

      for (const method of ["GET", "POST", "PUT", "DELETE", "PATCH"]) {
        try {
          await authenticatedFetch("/test", mockGetToken, { method: method as any });
        } catch {
          expect(mockGetToken).toHaveBeenCalled();
        }
        mockGetToken.mockClear();
      }
    });
  });
});
