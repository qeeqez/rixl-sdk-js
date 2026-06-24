import { describe, it, expect, vi, afterEach } from "vitest";
import {
  setTokenRefreshFunction,
  refreshTokenWithLock,
  createKyInstance,
  resetApiClient,
} from "../../auth/api/client-core";

// Mock dependencies
vi.mock("../../auth/api-url", () => ({
  apiURL: {
    get: vi.fn().mockReturnValue("https://api.example.com"),
  },
}));

describe("API Client Core", () => {
  afterEach(() => {
    vi.clearAllMocks();
    resetApiClient();
  });

  describe("refreshTokenWithLock", () => {
    it("should throw if refresh function not set", async () => {
      // @ts-ignore - explicitly setting null for test
      setTokenRefreshFunction(null);
      await expect(refreshTokenWithLock()).rejects.toThrow(
        "Token refresh function not initialized",
      );
    });

    it("should execute refresh function and return token", async () => {
      const mockRefresh = vi.fn().mockResolvedValue("new-token");
      setTokenRefreshFunction(mockRefresh);

      const result = await refreshTokenWithLock();
      expect(result).toBe("new-token");
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it("should prevent concurrent execution (mutex)", async () => {
      let resolveRefresh: (value: string) => void;
      const refreshPromise = new Promise<string>((resolve) => {
        resolveRefresh = resolve;
      });

      const mockRefresh = vi.fn().mockReturnValue(refreshPromise);
      setTokenRefreshFunction(mockRefresh);

      // Start multiple refreshes
      const p1 = refreshTokenWithLock();
      const p2 = refreshTokenWithLock();
      const p3 = refreshTokenWithLock();

      expect(mockRefresh).toHaveBeenCalledTimes(1);

      // Complete the refresh
      resolveRefresh!("refreshed-token");

      const results = await Promise.all([p1, p2, p3]);
      expect(results).toEqual(["refreshed-token", "refreshed-token", "refreshed-token"]);
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it("should clear lock after error", async () => {
      const mockRefresh = vi.fn().mockRejectedValue(new Error("Fail"));
      setTokenRefreshFunction(mockRefresh);

      await expect(refreshTokenWithLock()).rejects.toThrow("Fail");

      // Next call should try again
      mockRefresh.mockResolvedValue("success");
      const result = await refreshTokenWithLock();
      expect(result).toBe("success");
      expect(mockRefresh).toHaveBeenCalledTimes(2);
    });
  });

  describe("createKyInstance", () => {
    it("should create ky instance with a Ky v2 prefix", () => {
      const kyInstance = createKyInstance(async () => "token");
      expect(kyInstance).toBeDefined();
    });

    it("should include auth header in beforeRequest hook", async () => {
      const getToken = vi.fn().mockResolvedValue("access-token");
      const kyInstance = createKyInstance(getToken);

      global.fetch = vi.fn().mockResolvedValue(new Response("ok"));

      await kyInstance.get("test");

      expect(getToken).toHaveBeenCalled();
      const fetchCall = (global.fetch as any).mock.calls[0];
      const req = fetchCall[0] as Request;
      expect(req.headers.get("Authorization")).toBe("Bearer access-token");
    });

    it("should skip auth header if skipAuth is true", async () => {
      const getToken = vi.fn().mockResolvedValue("access-token");
      const kyInstance = createKyInstance(getToken, true);

      global.fetch = vi.fn().mockResolvedValue(new Response("ok"));
      await kyInstance.get("test");

      expect(getToken).not.toHaveBeenCalled();
      const fetchCall = (global.fetch as any).mock.calls[0];
      const req = fetchCall[0] as Request;
      expect(req.headers.get("Authorization")).toBeNull();
    });
  });
});
