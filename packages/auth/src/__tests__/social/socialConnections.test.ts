/**
 * Social Connections Module Tests
 * Tests: listSocials, connectSocialInternal, disconnectSocial, connectSocial
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  listSocials,
  connectSocialInternal,
  disconnectSocial,
  connectSocial,
  type ConnectedProvider,
} from "@/social/socialConnections.ts";

vi.mock("../../api/fetchers", async () => {
  const { createApiClientMock } = await import("../setup/mock-api-client");
  return createApiClientMock();
});

// Mock authStore
vi.mock("../../authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-token"),
  login: vi.fn(),
}));

// Mock initialization
vi.mock("../../initialization", () => ({
  initDeferred: {
    promise: Promise.resolve(),
  },
}));

// Mock social state
vi.mock("../../social/socialState", () => ({
  setSocialConnectAttempt: vi.fn(),
}));

describe("Social Connections Module", () => {
  let mockAuthenticatedFetch: any;
  let mockLogin: any;
  let mockSetSocialConnectAttempt: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const apiClient = await import("../../api/fetchers");
    mockAuthenticatedFetch = apiClient.authenticatedFetch;

    const authStore = await import("../../authStore");
    mockLogin = authStore.login;

    const socialState = await import("../../social/socialState");
    mockSetSocialConnectAttempt = socialState.setSocialConnectAttempt;
  });

  describe("listSocials", () => {
    it("should list connected providers successfully", async () => {
      const mockProviders: ConnectedProvider[] = [
        {
          provider: "google",
          username: "user@gmail.com",
          first_name: "John",
          last_name: "Doe",
          email_address: "user@gmail.com",
          image_url: "https://example.com/image.jpg",
        },
        {
          provider: "apple",
          email_address: "user@icloud.com",
        },
      ];

      mockAuthenticatedFetch.mockResolvedValue(mockProviders);

      const result = await listSocials();

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "providers",
        expect.any(Function),
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual(mockProviders);
    });

    it("should return empty array when no providers connected", async () => {
      mockAuthenticatedFetch.mockResolvedValue([]);

      const result = await listSocials();

      expect(result).toEqual([]);
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/types");
      const error = new ApiError("Unauthorized", 401, "providers");
      mockAuthenticatedFetch.mockRejectedValue(error);

      await expect(listSocials()).rejects.toThrow("User is not authorized to list providers!");
    });

    it("should handle single provider", async () => {
      const mockProvider: ConnectedProvider[] = [
        {
          provider: "microsoft",
          username: "user@outlook.com",
          email_address: "user@outlook.com",
        },
      ];

      mockAuthenticatedFetch.mockResolvedValue(mockProvider);

      const result = await listSocials();

      expect(result).toHaveLength(1);
      expect(result[0]?.provider).toBe("microsoft");
    });

    it("should handle providers with optional fields", async () => {
      const mockProviders: ConnectedProvider[] = [
        {
          provider: "telegram",
          username: "telegram_user",
        },
        {
          provider: "facebook",
          first_name: "Jane",
          last_name: "Smith",
        },
      ];

      mockAuthenticatedFetch.mockResolvedValue(mockProviders);

      const result = await listSocials();

      expect(result).toHaveLength(2);
      expect(result[0]?.provider).toBe("telegram");
      expect(result[1]?.provider).toBe("facebook");
    });
  });

  describe("connectSocialInternal", () => {
    it("should connect social provider successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await connectSocialInternal("google", "google-oauth-token");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "providers/connect",
        expect.any(Function),
        expect.objectContaining({
          method: "POST",
          body: { provider: "google", token: "google-oauth-token" },
        }),
      );
    });

    it("should connect different providers", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await connectSocialInternal("apple", "apple-id-token");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "providers/connect",
        expect.any(Function),
        expect.objectContaining({
          body: { provider: "apple", token: "apple-id-token" },
        }),
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/types");
      const error = new ApiError("Unauthorized", 401, "providers/connect");
      mockAuthenticatedFetch.mockRejectedValue(error);

      await expect(connectSocialInternal("google", "token")).rejects.toThrow(
        "User is not authorized to connect provider!",
      );
    });

    it("should validate input before sending", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await connectSocialInternal("microsoft", "ms-token-123");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "providers/connect",
        expect.any(Function),
        expect.objectContaining({
          method: "POST",
          body: expect.objectContaining({
            provider: "microsoft",
            token: "ms-token-123",
          }),
        }),
      );
    });
  });

  describe("disconnectSocial", () => {
    it("should disconnect social provider successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await disconnectSocial("provider-id-123");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "providers/provider-id-123",
        expect.any(Function),
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/types");
      const error = new ApiError("Unauthorized", 401, "providers/provider-id-123");
      mockAuthenticatedFetch.mockRejectedValue(error);

      await expect(disconnectSocial("provider-id-123")).rejects.toThrow(
        "User is not authorized to disconnect provider!",
      );
    });

    it("should handle provider not found error", async () => {
      const { ApiError } = await import("../../api/types");
      const error = new ApiError("Not Found", 404, "providers/nonexistent-id");
      mockAuthenticatedFetch.mockRejectedValue(error);

      await expect(disconnectSocial("nonexistent-id")).rejects.toThrow("Provider not found!");
    });

    it("should handle cannot disconnect last provider error", async () => {
      const { ApiError } = await import("../../api/types");
      const error = new ApiError("Bad Request", 400, "providers/last-provider-id");
      mockAuthenticatedFetch.mockRejectedValue(error);

      await expect(disconnectSocial("last-provider-id")).rejects.toThrow(
        "Cannot disconnect the last social provider!",
      );
    });

    it("should work with different provider IDs", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await disconnectSocial("another-provider-456");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "providers/another-provider-456",
        expect.any(Function),
        expect.any(Object),
      );
    });
  });

  describe("connectSocial", () => {
    it("should initiate google connection", () => {
      connectSocial("google");

      expect(mockSetSocialConnectAttempt).toHaveBeenCalledWith("google");
      expect(mockLogin).toHaveBeenCalledWith("google");
    });

    it("should initiate apple connection", () => {
      connectSocial("apple");

      expect(mockSetSocialConnectAttempt).toHaveBeenCalledWith("apple");
      expect(mockLogin).toHaveBeenCalledWith("apple");
    });

    it("should initiate microsoft connection", () => {
      connectSocial("microsoft");

      expect(mockSetSocialConnectAttempt).toHaveBeenCalledWith("microsoft");
      expect(mockLogin).toHaveBeenCalledWith("microsoft");
    });

    it("should initiate facebook connection", () => {
      connectSocial("facebook");

      expect(mockSetSocialConnectAttempt).toHaveBeenCalledWith("facebook");
      expect(mockLogin).toHaveBeenCalledWith("facebook");
    });

    it("should initiate telegram connection", () => {
      connectSocial("telegram");

      expect(mockSetSocialConnectAttempt).toHaveBeenCalledWith("telegram");
      expect(mockLogin).toHaveBeenCalledWith("telegram");
    });

    it("should set connection attempt before login", () => {
      const callOrder: string[] = [];

      mockSetSocialConnectAttempt.mockImplementation(() => {
        callOrder.push("setSocialConnectAttempt");
      });

      mockLogin.mockImplementation(() => {
        callOrder.push("login");
      });

      connectSocial("google");

      expect(callOrder).toEqual(["setSocialConnectAttempt", "login"]);
    });
  });
});
