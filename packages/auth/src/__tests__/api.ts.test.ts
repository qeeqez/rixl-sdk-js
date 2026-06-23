/**
 * API module tests
 * Tests: apiURL, refreshTokens
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { refreshTokens } from "../api/refresh-tokens";
import { apiURL } from "../api-url";
import { AuthProvider } from "@/providers";
import { ApiError } from "../api/types";

// Mock API fetchers
vi.mock("../api/fetchers", () => ({
  publicFetch: vi.fn(),
}));

// Mock API types
vi.mock("../api/types", () => ({
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

describe("API Module", () => {
  let mockPublicFetch: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const fetchers = await import("../api/fetchers");
    mockPublicFetch = fetchers.publicFetch;

    // Set a test API URL
    apiURL.set("https://api.example.com");
  });

  describe("apiURL", () => {
    it("should store and retrieve API URL", () => {
      apiURL.set("https://test.api.com");
      expect(apiURL.get()).toBe("https://test.api.com");
    });

    it("should allow updating API URL", () => {
      apiURL.set("https://api1.com");
      expect(apiURL.get()).toBe("https://api1.com");

      apiURL.set("https://api2.com");
      expect(apiURL.get()).toBe("https://api2.com");
    });
  });

  describe("refreshTokens", () => {
    it("should refresh tokens successfully", async () => {
      const mockResponse = {
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
      };

      mockPublicFetch.mockResolvedValue(mockResponse);

      const result = await refreshTokens(AuthProvider.BEARER, "old-refresh-token");

      expect(mockPublicFetch).toHaveBeenCalledWith("token", {
        method: "POST",
        headers: { Authorization: "Bearer old-refresh-token" },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle 401 unauthorized error", async () => {
      mockPublicFetch.mockRejectedValue(new ApiError("Unauthorized", 401, "token"));

      await expect(refreshTokens(AuthProvider.BEARER, "invalid-token")).rejects.toThrow(
        "Unauthorized",
      );
    });

    it("should propagate errors (no side effects in this function)", async () => {
      mockPublicFetch.mockRejectedValue(new ApiError("Refresh token expired", 400, "token"));

      await expect(refreshTokens(AuthProvider.BEARER, "expired-token")).rejects.toThrow(
        "Refresh token expired",
      );
    });

    it("should work with different providers", async () => {
      const mockResponse = {
        access_token: "token",
        refresh_token: "refresh",
        expires_in: 7200,
      };

      mockPublicFetch.mockResolvedValue(mockResponse);

      await refreshTokens(AuthProvider.GOOGLE, "google-token");

      expect(mockPublicFetch).toHaveBeenCalledWith(
        "token",
        expect.objectContaining({
          headers: { Authorization: "google google-token" },
        }),
      );
    });

    it("should handle network errors", async () => {
      mockPublicFetch.mockRejectedValue(new Error("Network error"));

      await expect(refreshTokens(AuthProvider.BEARER, "token")).rejects.toThrow("Network error");
    });

    it("should return parsed JSON response", async () => {
      const mockResponse = {
        access_token: "access123",
        refresh_token: "refresh456",
        expires_in: 1800,
      };

      mockPublicFetch.mockResolvedValue(mockResponse);

      const result = await refreshTokens(AuthProvider.BEARER, "token");

      expect(result).toEqual(mockResponse);
    });
  });
});
