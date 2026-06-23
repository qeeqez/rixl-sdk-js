import { describe, it, expect, beforeEach, vi } from "vitest";
import { initClient, type AuthClientConfig } from "../../init";

// Mock implementation
vi.mock("../../api", () => ({
  apiURL: { set: vi.fn(), get: vi.fn() },
}));

vi.mock("../../authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-access-token"),
  refreshToken: { get: vi.fn() },
}));

vi.mock("../../initialization", () => ({
  initDeferred: { promise: Promise.resolve(), resolve: vi.fn() },
}));

vi.mock("../../providers", () => ({
  detectProvider: vi.fn(),
  getProviderToken: vi.fn(),
}));

vi.mock("../../social/socialState", () => ({
  hasSocialConnectAttempt: vi.fn().mockReturnValue(false),
  clearSocialConnectAttempt: vi.fn(),
}));

vi.mock("../../social/socialConnections", () => ({
  connectSocialInternal: vi.fn(),
}));

vi.mock("../../api/client-core", () => ({
  setTokenRefreshFunction: vi.fn(),
}));

describe("initClient - Social Connection Flow", () => {
  let mockDetectProvider: any;
  let mockGetProviderToken: any;
  let mockHasSocialConnectAttempt: any;
  let mockClearSocialConnectAttempt: any;
  let mockConnectSocialInternal: any;
  let mockRefreshToken: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const providers = await import("../../providers");
    mockDetectProvider = providers.detectProvider;
    mockGetProviderToken = providers.getProviderToken;

    const socialState = await import("../../social/socialState");
    mockHasSocialConnectAttempt = socialState.hasSocialConnectAttempt;
    mockClearSocialConnectAttempt = socialState.clearSocialConnectAttempt;

    const socialConnections = await import("../../social/socialConnections");
    mockConnectSocialInternal = socialConnections.connectSocialInternal;

    const authStore = await import("../../authStore");
    mockRefreshToken = authStore.refreshToken;
  });

  it("should handle social connection attempt", async () => {
    const config: AuthClientConfig = { apiUrl: "https://api.example.com" };

    mockDetectProvider.mockReturnValue("google");
    mockGetProviderToken.mockReturnValue("oauth-token");
    mockHasSocialConnectAttempt.mockReturnValue(true);
    mockRefreshToken.get.mockReturnValue("existing-token");
    mockConnectSocialInternal.mockResolvedValue(undefined);

    await initClient(config);

    expect(mockHasSocialConnectAttempt).toHaveBeenCalledWith("google");
    expect(mockConnectSocialInternal).toHaveBeenCalledWith("google", "oauth-token");
    expect(mockClearSocialConnectAttempt).toHaveBeenCalledWith("google");
  });

  it("should clear social attempt flag even if connection fails", async () => {
    const config: AuthClientConfig = { apiUrl: "https://api.example.com" };

    mockDetectProvider.mockReturnValue("apple");
    mockGetProviderToken.mockReturnValue("apple-token");
    mockHasSocialConnectAttempt.mockReturnValue(true);
    mockRefreshToken.get.mockReturnValue("token");
    mockConnectSocialInternal.mockRejectedValue(new Error("Connection failed"));

    await expect(initClient(config)).rejects.toThrow("Connection failed");

    expect(mockClearSocialConnectAttempt).toHaveBeenCalledWith("apple");
  });
});
