import { describe, it, expect, beforeEach, vi } from "vitest";
import { initClient, type AuthClientConfig } from "../../init";

// Mock API module
vi.mock("../../api-url", () => ({
  apiURL: { set: vi.fn(), get: vi.fn() },
}));
vi.mock("../../api/refresh-tokens", () => ({
  refreshTokens: vi.fn(),
}));

// Mock authStore
vi.mock("../../authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-access-token"),
  refreshToken: { get: vi.fn() },
  accessToken: { set: vi.fn() },
  expireAt: { set: vi.fn() },
}));

// Mock initialization
vi.mock("../../initialization", () => ({
  initDeferred: {
    promise: Promise.resolve(),
    resolve: vi.fn(),
  },
}));

// Mock providers
vi.mock("../../providers", () => ({
  googleConfig: { set: vi.fn() },
  telegramConfig: { set: vi.fn() },
  appleConfig: { set: vi.fn() },
  microsoftConfig: { set: vi.fn() },
  updateGoogleAuthUrl: vi.fn(),
  updateAppleAuthUrl: vi.fn(),
  updateMicrosoftAuthUrl: vi.fn(),
  updateTelegramAuthUrl: vi.fn(),
  getProviderToken: vi.fn(),
  detectProvider: vi.fn(),
  AuthProvider: { BEARER: "bearer" },
}));

// Mock API client core
vi.mock("../../api/client-core", () => ({
  setTokenRefreshFunction: vi.fn(),
}));

vi.mock("../../api/sdk-client", () => ({
  configureSdkClient: vi.fn(),
}));

describe("initClient - Basic Configuration", () => {
  let mockApiURL: any;
  let mockSetTokenRefreshFunction: any;
  let mockInitDeferred: any;
  let mockDetectProvider: any;
  let mockGetToken: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { apiURL } = await import("../../api-url");
    mockApiURL = apiURL;

    const apiClientCore = await import("../../api/client-core");
    mockSetTokenRefreshFunction = apiClientCore.setTokenRefreshFunction;

    const initialization = await import("../../initialization");
    mockInitDeferred = initialization.initDeferred;

    const providers = await import("../../providers");
    mockDetectProvider = providers.detectProvider;

    const authStore = await import("../../authStore");
    mockGetToken = authStore.getToken;
  });

  it("should initialize with minimal config", async () => {
    const config: AuthClientConfig = {
      apiUrl: "https://api.example.com",
    };

    mockDetectProvider.mockReturnValue(undefined);
    mockGetToken.mockResolvedValue("access-token");

    const token = await initClient(config);

    expect(mockApiURL.set).toHaveBeenCalledWith("https://api.example.com");
    expect(mockSetTokenRefreshFunction).toHaveBeenCalled();
    expect(mockInitDeferred.resolve).toHaveBeenCalled();
    expect(token).toBe("access-token");
  });

  it("should initialize with all providers", async () => {
    const config: AuthClientConfig = {
      apiUrl: "https://api.example.com",
      googleProvider: { clientId: "google-id" },
      appleProvider: { clientId: "apple-id" },
      microsoftProvider: { clientId: "ms-id" },
      telegramProvider: { botId: "bot" },
    };

    const providers = await import("../../providers");
    mockDetectProvider.mockReturnValue(undefined);
    mockGetToken.mockResolvedValue("token");

    await initClient(config);

    expect(providers.googleConfig.set).toHaveBeenCalled();
    expect(providers.appleConfig.set).toHaveBeenCalled();
    expect(providers.microsoftConfig.set).toHaveBeenCalled();
    expect(providers.telegramConfig.set).toHaveBeenCalled();
  });
});
