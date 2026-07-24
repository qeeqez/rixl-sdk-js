import {describe, it, expect, beforeEach, vi} from "vitest";
import {listSocials, connectSocialInternal, disconnectSocial, connectSocial, type ConnectedProvider} from "@/social/socialConnections.ts";
import * as initialization from "../../auth/initialization";

const mockGetAuthV1Providers = vi.fn();
const mockPostAuthV1ProvidersConnect = vi.fn();
const mockDeleteAuthV1ProvidersByProvider = vi.fn();

vi.mock("../../generated/sdk.gen", () => ({
  authV1ProvidersServiceListProviders: (...args: unknown[]) => mockGetAuthV1Providers(...args),
  authV1ProvidersServiceConnectProvider: (...args: unknown[]) => mockPostAuthV1ProvidersConnect(...args),
  authV1ProvidersServiceDisconnectProvider: (...args: unknown[]) => mockDeleteAuthV1ProvidersByProvider(...args),
}));

vi.mock("../../auth/authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-token"),
  login: vi.fn(),
}));

vi.mock("../../auth/social/socialState", () => ({
  setSocialConnectAttempt: vi.fn(),
}));

describe("Social Connections Module", () => {
  let mockLogin: any;
  let mockSetSocialConnectAttempt: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    initialization.initDeferred.promise = Promise.resolve();
    mockGetAuthV1Providers.mockReset();
    mockPostAuthV1ProvidersConnect.mockReset();
    mockDeleteAuthV1ProvidersByProvider.mockReset();

    const authStore = await import("../../auth/authStore");
    mockLogin = authStore.login;

    const socialState = await import("../../auth/social/socialState");
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

      mockGetAuthV1Providers.mockResolvedValue({data: {providers: mockProviders}});

      const result = await listSocials();

      expect(mockGetAuthV1Providers).toHaveBeenCalledWith({
        throwOnError: true,
      });
      expect(result).toEqual(mockProviders);
    });

    it("should return empty array when no providers connected", async () => {
      mockGetAuthV1Providers.mockResolvedValue({data: {providers: []}});

      const result = await listSocials();

      expect(result).toEqual([]);
    });

    it("should handle unauthorized error", async () => {
      mockGetAuthV1Providers.mockRejectedValue({error: "unauthorized", code: 401});

      await expect(listSocials()).rejects.toThrow();
    });

    it("should handle single provider", async () => {
      const mockProvider: ConnectedProvider[] = [
        {
          provider: "microsoft",
          username: "user@outlook.com",
          email_address: "user@outlook.com",
        },
      ];

      mockGetAuthV1Providers.mockResolvedValue({data: {providers: mockProvider}});

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

      mockGetAuthV1Providers.mockResolvedValue({data: {providers: mockProviders}});

      const result = await listSocials();

      expect(result).toHaveLength(2);
      expect(result[0]?.provider).toBe("telegram");
      expect(result[1]?.provider).toBe("facebook");
    });
  });

  describe("connectSocialInternal", () => {
    it("should connect social provider successfully", async () => {
      mockPostAuthV1ProvidersConnect.mockResolvedValue({data: {}});

      await connectSocialInternal("google", "google-oauth-token");

      expect(mockPostAuthV1ProvidersConnect).toHaveBeenCalledWith({
        body: {provider: "google", token: "google-oauth-token"},
        throwOnError: true,
      });
    });

    it("should connect different providers", async () => {
      mockPostAuthV1ProvidersConnect.mockResolvedValue({data: {}});

      await connectSocialInternal("apple", "apple-id-token");

      expect(mockPostAuthV1ProvidersConnect).toHaveBeenCalledWith({
        body: {provider: "apple", token: "apple-id-token"},
        throwOnError: true,
      });
    });

    it("should handle unauthorized error", async () => {
      mockPostAuthV1ProvidersConnect.mockRejectedValue({error: "unauthorized", code: 401});

      await expect(connectSocialInternal("google", "token")).rejects.toThrow();
    });

    it("should validate input before sending", async () => {
      mockPostAuthV1ProvidersConnect.mockResolvedValue({data: {}});

      await connectSocialInternal("microsoft", "ms-token-123");

      expect(mockPostAuthV1ProvidersConnect).toHaveBeenCalledWith({
        body: expect.objectContaining({
          provider: "microsoft",
          token: "ms-token-123",
        }),
        throwOnError: true,
      });
    });
  });

  describe("disconnectSocial", () => {
    it("should disconnect social provider successfully", async () => {
      mockDeleteAuthV1ProvidersByProvider.mockResolvedValue({data: {}});

      await disconnectSocial("provider-id-123");

      expect(mockDeleteAuthV1ProvidersByProvider).toHaveBeenCalledWith({
        path: {provider: "provider-id-123"},
        throwOnError: true,
      });
    });

    it("should handle unauthorized error", async () => {
      mockDeleteAuthV1ProvidersByProvider.mockRejectedValue({error: "unauthorized", code: 401});

      await expect(disconnectSocial("provider-id-123")).rejects.toThrow();
    });

    it("should handle provider not found error", async () => {
      mockDeleteAuthV1ProvidersByProvider.mockRejectedValue({error: "not_found", code: 404});

      await expect(disconnectSocial("nonexistent-id")).rejects.toThrow();
    });

    it("should handle cannot disconnect last provider error", async () => {
      mockDeleteAuthV1ProvidersByProvider.mockRejectedValue({error: "bad_request", code: 400});

      await expect(disconnectSocial("last-provider-id")).rejects.toThrow();
    });

    it("should work with different provider IDs", async () => {
      mockDeleteAuthV1ProvidersByProvider.mockResolvedValue({data: {}});

      await disconnectSocial("another-provider-456");

      expect(mockDeleteAuthV1ProvidersByProvider).toHaveBeenCalledWith({
        path: {provider: "another-provider-456"},
        throwOnError: true,
      });
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
