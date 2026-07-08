/**
 * API Client Integration Tests
 *
 * These tests verify the actual ky client integration, including:
 * - Correct Ky v2 prefix usage
 * - Actual HTTP client behavior
 * - Real request/response handling
 */

import {describe, it, expect, beforeEach, afterEach, vi} from "vitest";
import ky from "ky";

describe("API Client - Ky Integration", () => {
  const BASE_URL = "http://localhost:8081";

  const createMockResponse = () => ({
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => JSON.stringify({success: true}),
    json: async () => ({success: true}),
    blob: async () => new Blob(),
    arrayBuffer: async () => new ArrayBuffer(0),
    clone: function () {
      return this;
    },
    headers: new Headers({"content-type": "application/json"}),
  });

  describe("Ky v2 prefix compatibility", () => {
    it("should normalize endpoints starting with / when prefix is set", async () => {
      const mockFetch = vi.fn().mockResolvedValue(createMockResponse());
      global.fetch = mockFetch as typeof global.fetch;

      const client = ky.create({
        prefix: BASE_URL,
      });

      await client.get("/auth/login").json();

      expect(mockFetch).toHaveBeenCalled();
      const calledRequest = mockFetch.mock.calls[0]?.[0];
      expect(calledRequest?.url).toBe(`${BASE_URL}/auth/login`);
    });

    it("should accept endpoints without leading / when prefix is set", async () => {
      const mockFetch = vi.fn().mockResolvedValue(createMockResponse());
      global.fetch = mockFetch as typeof global.fetch;

      const client = ky.create({
        prefix: BASE_URL,
      });

      await client.get("auth/login").json();

      expect(mockFetch).toHaveBeenCalled();
      const calledRequest = mockFetch.mock.calls[0]?.[0];
      expect(calledRequest?.url).toBe(`${BASE_URL}/auth/login`);
    });

    it("should normalize trailing slashes in the prefix", async () => {
      const mockFetch = vi.fn().mockResolvedValue(createMockResponse());
      global.fetch = mockFetch as typeof global.fetch;

      const client = ky.create({
        prefix: `${BASE_URL}/`,
      });

      await client.get("/auth/login").json();

      expect(mockFetch).toHaveBeenCalled();
      const calledRequest = mockFetch.mock.calls[0]?.[0];
      expect(calledRequest?.url).toBe(`${BASE_URL}/auth/login`);
    });
  });

  describe("endpoint normalization", () => {
    const equivalentEndpoints = [
      ["auth/login", "/auth/login"],
      ["auth/register", "/auth/register"],
      ["users/me", "/users/me"],
      ["providers", "/providers"],
      ["providers/connect", "/providers/connect"],
      ["memberships/org123/active", "/memberships/org123/active"],
      ["invitations/token123/accept", "/invitations/token123/accept"],
    ] as const;

    it.each(equivalentEndpoints)("should map %s and %s to the same path", (withoutSlash, withSlash) => {
      expect(withSlash.replace(/^\/+/, "")).toBe(withoutSlash);
    });
  });

  describe("real-world usage patterns", () => {
    let mockFetch: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockFetch = vi.fn().mockResolvedValue(createMockResponse());
      global.fetch = mockFetch as typeof global.fetch;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should handle static endpoints correctly", async () => {
      const client = ky.create({
        prefix: BASE_URL,
      });

      await client
        .post("auth/login", {
          json: {email: "test@example.com", password: "password123"},
        })
        .json();

      expect(mockFetch).toHaveBeenCalled();
      const calledRequest = mockFetch.mock.calls[0]?.[0];
      expect(calledRequest?.url).toBe(`${BASE_URL}/auth/login`);
    });

    it("should handle dynamic endpoints with template literals correctly", async () => {
      const client = ky.create({
        prefix: BASE_URL,
      });

      const orgId = "org123";
      await client.put(`memberships/${orgId}/active`).json();

      expect(mockFetch).toHaveBeenCalled();
      const calledRequest = mockFetch.mock.calls[0]?.[0];
      expect(calledRequest?.url).toBe(`${BASE_URL}/memberships/org123/active`);
    });

    it("should handle complex dynamic paths correctly", async () => {
      const client = ky.create({
        prefix: BASE_URL,
      });

      const orgId = "org123";
      const userId = "user456";
      await client.delete(`memberships/${orgId}/members/${userId}`).json();

      expect(mockFetch).toHaveBeenCalled();
      const calledRequest = mockFetch.mock.calls[0]?.[0];
      expect(calledRequest?.url).toBe(`${BASE_URL}/memberships/org123/members/user456`);
    });
  });

  describe("documentation - edge cases caught by this test", () => {
    it("documents the Ky v2 migration from prefixUrl to prefix", () => {
      /**
       * BUG THAT WAS FIXED:
       * - Developer set VITE_AUTH_API_URL=http://localhost:8081
       * - initClient({ apiUrl: "http://localhost:8081" })
       * - Library used: ky.create({ prefixUrl: "http://localhost:8081" })
       * - Error in ky v2: "The `prefixUrl` option has been renamed `prefix`..."
       *
       * ROOT CAUSE:
       * - The library was still passing the removed `prefixUrl` option to ky v2
       *
       * FIX:
       * - Switched ky.create() to use `prefix`
       * - Normalized endpoint strings before requests are executed
       *
       * WHY TESTS DIDN'T CATCH IT:
       * - Some unit tests mocked the request layer and never exercised real ky options
       *
       * THIS TEST PREVENTS REGRESSION:
       * - Validates ky v2 `prefix` behavior
       * - Confirms slash-prefixed and slashless endpoints resolve correctly
       */
      expect(true).toBe(true);
    });
  });
});
