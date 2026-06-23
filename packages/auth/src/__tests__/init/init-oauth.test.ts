import { describe, it, expect, beforeEach, vi } from "vitest";
import { initClient, type AuthClientConfig } from "../../init";

// Mock implementation
vi.mock("../../api-url", () => ({
  apiURL: { set: vi.fn(), get: vi.fn() },
}));
vi.mock("../../api/refresh-tokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock("../../authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-access-token"),
  refreshToken: { get: vi.fn() },
  expireAt: { set: vi.fn() },
  accessToken: { set: vi.fn() },
  authError: { set: vi.fn() },
  setTokens: vi.fn(),
  setLimitedAccessState: vi.fn(),
}));

vi.mock("../../initialization", () => ({
  initDeferred: { promise: Promise.resolve(), resolve: vi.fn() },
}));

vi.mock("../../providers", () => ({
  detectProvider: vi.fn(),
  getProviderToken: vi.fn(),
  googleConfig: { set: vi.fn() },
  appleConfig: { set: vi.fn() },
  microsoftConfig: { set: vi.fn() },
  telegramConfig: { set: vi.fn() },
  getRedirectUrl: vi.fn(),
  updateGoogleAuthUrl: vi.fn(),
  updateAppleAuthUrl: vi.fn(),
  updateMicrosoftAuthUrl: vi.fn(),
  updateTelegramAuthUrl: vi.fn(),
  AuthProvider: { BEARER: "bearer" },
}));

vi.mock("../../api/client-core", () => ({
  setTokenRefreshFunction: vi.fn(),
}));

describe("initClient - OAuth Callback Handling", () => {
  let mockDetectProvider: any;
  let mockGetProviderToken: any;
  let mockRefreshTokens: any;
  let mockRefreshToken: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const providers = await import("../../providers");
    mockDetectProvider = providers.detectProvider;
    mockGetProviderToken = providers.getProviderToken;

    const api = await import("../../api/refresh-tokens");
    mockRefreshTokens = api.refreshTokens;

    const authStore = await import("../../authStore");
    mockRefreshToken = authStore.refreshToken;
  });

  it("should handle OAuth callback with token", async () => {
    const config: AuthClientConfig = { apiUrl: "https://api.example.com" };

    mockDetectProvider.mockReturnValue("google");
    mockGetProviderToken.mockReturnValue("oauth-token");
    mockRefreshToken.get.mockReturnValue(null);
    mockRefreshTokens.mockResolvedValue({
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
    });

    await initClient(config);

    expect(mockDetectProvider).toHaveBeenCalled();
    expect(mockGetProviderToken).toHaveBeenCalledWith("google");
    expect(mockRefreshTokens).toHaveBeenCalledWith("google", "oauth-token");
  });

  it("should skip token refresh if refresh token exists", async () => {
    const config: AuthClientConfig = { apiUrl: "https://api.example.com" };

    mockDetectProvider.mockReturnValue("google");
    mockGetProviderToken.mockReturnValue("oauth-token");
    mockRefreshToken.get.mockReturnValue("existing-refresh-token");

    await initClient(config);

    expect(mockRefreshTokens).not.toHaveBeenCalled();
  });
});
