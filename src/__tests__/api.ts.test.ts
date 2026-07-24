import {describe, it, expect, beforeEach, vi} from "vitest";
import {refreshTokens} from "../auth/api/refresh-tokens";
import {apiURL} from "../auth/api-url";
import {AuthProvider} from "@/providers";

const mockPostAuthV1Token = vi.fn();

vi.mock("../generated/sdk.gen", () => ({
  authV1TokenServiceRefreshToken: (...args: unknown[]) => mockPostAuthV1Token(...args),
}));

describe("API Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPostAuthV1Token.mockReset();
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

      mockPostAuthV1Token.mockResolvedValue({data: mockResponse});

      const result = await refreshTokens(AuthProvider.BEARER, "old-refresh-token");

      expect(mockPostAuthV1Token).toHaveBeenCalledWith({
        body: {},
        headers: {Authorization: "Bearer old-refresh-token"},
        throwOnError: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle 401 unauthorized error", async () => {
      mockPostAuthV1Token.mockRejectedValue({error: "unauthorized", code: 401});

      await expect(refreshTokens(AuthProvider.BEARER, "invalid-token")).rejects.toThrow();
    });

    it("should propagate errors (no side effects in this function)", async () => {
      mockPostAuthV1Token.mockRejectedValue({error: "bad_request", code: 400});

      await expect(refreshTokens(AuthProvider.BEARER, "expired-token")).rejects.toThrow();
    });

    it("should work with different providers", async () => {
      const mockResponse = {
        access_token: "token",
        refresh_token: "refresh",
        expires_in: 7200,
      };

      mockPostAuthV1Token.mockResolvedValue({data: mockResponse});

      await refreshTokens(AuthProvider.GOOGLE, "google-token");

      expect(mockPostAuthV1Token).toHaveBeenCalledWith({
        body: {},
        headers: {Authorization: "google google-token"},
        throwOnError: true,
      });
    });

    it("should handle network errors", async () => {
      mockPostAuthV1Token.mockRejectedValue(new Error("Network error"));

      await expect(refreshTokens(AuthProvider.BEARER, "token")).rejects.toThrow("Network error");
    });

    it("should return parsed JSON response", async () => {
      const mockResponse = {
        access_token: "access123",
        refresh_token: "refresh456",
        expires_in: 1800,
      };

      mockPostAuthV1Token.mockResolvedValue({data: mockResponse});

      const result = await refreshTokens(AuthProvider.BEARER, "token");

      expect(result).toEqual(mockResponse);
    });
  });
});
