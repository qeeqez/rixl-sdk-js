import {describe, it, expect, beforeEach, vi} from "vitest";
import {initClient, type AuthClientConfig} from "../../auth/init";

// Mock implementation
vi.mock("../../auth/api-url", () => ({
  apiURL: {set: vi.fn(), get: vi.fn()},
}));
vi.mock("../../auth/api/refresh-tokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock("../../auth/authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-access-token"),
  refreshToken: {get: vi.fn()},
  expireAt: {set: vi.fn()},
  accessToken: {set: vi.fn()},
}));

vi.mock("../../auth/initialization", () => ({
  initDeferred: {promise: Promise.resolve(), resolve: vi.fn()},
}));

vi.mock("../../auth/providers", () => ({
  detectProvider: vi.fn().mockReturnValue(undefined),
  getProviderToken: vi.fn(),
  AuthProvider: {BEARER: "bearer"},
  googleConfig: {set: vi.fn()},
  appleConfig: {set: vi.fn()},
  microsoftConfig: {set: vi.fn()},
  telegramConfig: {set: vi.fn()},
  updateGoogleAuthUrl: vi.fn(),
  updateAppleAuthUrl: vi.fn(),
  updateMicrosoftAuthUrl: vi.fn(),
  updateTelegramAuthUrl: vi.fn(),
}));

vi.mock("../../auth/api/client-core", () => ({
  setTokenRefreshFunction: vi.fn(),
}));

vi.mock("../../auth/api/sdk-client", () => ({
  configureSdkClient: vi.fn(),
}));

describe("initClient - Token Refresh Function", () => {
  let mockSetTokenRefreshFunction: any;
  let mockGetToken: any;
  let mockRefreshToken: any;
  let mockRefreshTokens: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const apiClientCore = await import("../../auth/api/client-core");
    mockSetTokenRefreshFunction = apiClientCore.setTokenRefreshFunction;

    const authStore = await import("../../auth/authStore");
    mockGetToken = authStore.getToken;
    mockRefreshToken = authStore.refreshToken;

    const api = await import("../../auth/api/refresh-tokens");
    mockRefreshTokens = api.refreshTokens;
  });

  it("should set up token refresh function", async () => {
    const config: AuthClientConfig = {apiUrl: "https://api.example.com"};
    await initClient(config);
    expect(mockSetTokenRefreshFunction).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should refresh token when function is called", async () => {
    const config: AuthClientConfig = {apiUrl: "https://api.example.com"};
    await initClient(config);

    const refreshFunction = mockSetTokenRefreshFunction.mock.calls[0][0];
    mockRefreshToken.get.mockReturnValue("refresh-token-value");
    mockGetToken.mockResolvedValue("refreshed-token");

    const newToken = await refreshFunction();

    expect(mockRefreshTokens).toHaveBeenCalledWith("bearer", "refresh-token-value");
    expect(newToken).toBe("refreshed-token");
  });

  it("should return undefined if no refresh token available", async () => {
    const config: AuthClientConfig = {apiUrl: "https://api.example.com"};
    await initClient(config);

    const refreshFunction = mockSetTokenRefreshFunction.mock.calls[0][0];
    mockRefreshToken.get.mockReturnValue(undefined);

    const result = await refreshFunction();

    expect(result).toBeUndefined();
    expect(mockRefreshTokens).not.toHaveBeenCalled();
  });
});
