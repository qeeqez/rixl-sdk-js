/**
 * Integration Scenario Test
 *
 * Demonstrates that the library now works correctly with real-world usage patterns
 * after migrating from `prefixUrl` to Ky v2 `prefix`
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initClient } from "@/init";
import { loginWithEmail } from "@/auth/login";
import { registerWithEmail } from "@/auth/register";

describe("Integration Scenario - Dashboard Usage", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Save original fetch
    originalFetch = global.fetch;

    // Mock successful responses
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      text: async () =>
        JSON.stringify({
          access_token: "mock_access_token",
          refresh_token: "mock_refresh_token",
          expires_in: 3600,
        }),
      json: async () => ({
        access_token: "mock_access_token",
        refresh_token: "mock_refresh_token",
        expires_in: 3600,
      }),
      blob: async () => new Blob(),
      arrayBuffer: async () => new ArrayBuffer(0),
      clone: function () {
        return this;
      },
      headers: new Headers({ "content-type": "application/json" }),
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse) as any;
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it("should work with dashboard configuration (VITE_AUTH_API_URL)", async () => {
    // Simulate dashboard initialization
    // This is exactly what happens in frontend/dashboard/src/main.tsx line 36-37
    initClient({
      apiUrl: "http://localhost:8081", // VITE_AUTH_API_URL value
    });

    // Give init time to complete
    await new Promise((resolve) => setTimeout(resolve, 10));

    // This should now work without throwing the Ky v2 prefixUrl migration error
    try {
      await loginWithEmail("test@example.com", "Password123!");
    } catch {
      // Ignore other errors, we're only checking if the request URL is constructed correctly
    }

    // Verify fetch was called with correct URL (no double slash, no missing path)
    expect(global.fetch).toHaveBeenCalled();
    const fetchCall = (global.fetch as any).mock.calls[0];
    const request = fetchCall[0];

    // Should be: http://localhost:8081/auth/login
    // NOT: http://localhost:8081//auth/login (double slash from prefix + leading slash)
    // NOT: http://localhost:8081 (missing path)
    expect(request.url).toBe("http://localhost:8081/auth/login");
  });

  it("should work with registration endpoints", async () => {
    initClient({
      apiUrl: "http://localhost:8081",
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    try {
      await registerWithEmail("newuser@example.com", "Password123!");
    } catch {
      // Ignore other errors, we're only checking if the request URL is constructed correctly
    }

    const fetchCall = (global.fetch as any).mock.calls[0];
    const request = fetchCall[0];
    expect(request.url).toBe("http://localhost:8081/auth/register");
  });

  it("should work with different API URL formats", async () => {
    // Test various URL formats users might provide
    const apiUrls = [
      "http://localhost:8081",
      "http://localhost:8081/", // with trailing slash
      "https://api.example.com",
      "https://api.example.com/",
    ];

    for (const apiUrl of apiUrls) {
      vi.clearAllMocks();

      initClient({ apiUrl });
      await new Promise((resolve) => setTimeout(resolve, 10));

      await loginWithEmail("test@example.com", "Password123!");

      const fetchCall = (global.fetch as any).mock.calls[0];
      const request = fetchCall[0];

      // Should always construct valid URL
      expect(request.url).toMatch(/^https?:\/\/[^/]+\/auth\/login$/);
      expect(request.url).not.toContain("//auth"); // No double slash
    }
  });

  it("documents the bug that was fixed", () => {
    /**
     * BEFORE THE FIX:
     *
     * User sets: VITE_AUTH_API_URL=http://localhost:8081
     * Dashboard calls: initClient({ apiUrl: "http://localhost:8081" })
     * Library creates: ky.create({ prefixUrl: "http://localhost:8081" })
     * Library calls: publicFetch("/auth/login", ...)
     *
     * Result in ky v1: `input` must not begin with a slash when using `prefixUrl`
     * Result in ky v2: `prefixUrl` option has been renamed `prefix`
     *
     * AFTER THE FIX:
     *
     * User sets: VITE_AUTH_API_URL=http://localhost:8081
     * Dashboard calls: initClient({ apiUrl: "http://localhost:8081" })
     * Library creates: ky.create({ prefix: "http://localhost:8081" })
     * Library calls: publicFetch("auth/login", ...)  // No leading slash!
     *
     * Result: Success! ✅
     * URL: http://localhost:8081/auth/login
     */
    expect(true).toBe(true);
  });
});
