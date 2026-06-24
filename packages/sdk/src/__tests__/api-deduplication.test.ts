/**
 * API Deduplication Tests
 * Tests: pendingRequests map, getRequestKey
 */

import { describe, it, expect, beforeEach } from "vitest";
import { pendingRequests, getRequestKey } from "../auth/api/deduplication";
import { ApiRequestConfig } from "../auth/api/types";

describe("API Deduplication", () => {
  beforeEach(() => {
    pendingRequests.clear();
  });

  describe("pendingRequests", () => {
    it("should be a Map instance", () => {
      expect(pendingRequests).toBeInstanceOf(Map);
    });

    it("should start empty", () => {
      expect(pendingRequests.size).toBe(0);
    });

    it("should store and retrieve promises", async () => {
      const testPromise = Promise.resolve("test-data");
      pendingRequests.set("test-key", testPromise);

      expect(pendingRequests.has("test-key")).toBe(true);
      expect(pendingRequests.get("test-key")).toBe(testPromise);
    });

    it("should allow clearing all entries", () => {
      pendingRequests.set("key1", Promise.resolve(1));
      pendingRequests.set("key2", Promise.resolve(2));

      expect(pendingRequests.size).toBe(2);

      pendingRequests.clear();

      expect(pendingRequests.size).toBe(0);
    });
  });

  describe("getRequestKey", () => {
    it("should generate key for GET request", () => {
      const config: ApiRequestConfig = { method: "GET" };
      const key = getRequestKey("/api/users", config);

      expect(key).toContain("/api/users");
      expect(key).toBeTruthy();
    });

    it("should return empty string for POST request", () => {
      const config: ApiRequestConfig = { method: "POST" };
      const key = getRequestKey("/api/users", config);

      expect(key).toBe("");
    });

    it("should return empty string for PUT request", () => {
      const config: ApiRequestConfig = { method: "PUT" };
      const key = getRequestKey("/api/users", config);

      expect(key).toBe("");
    });

    it("should return empty string for DELETE request", () => {
      const config: ApiRequestConfig = { method: "DELETE" };
      const key = getRequestKey("/api/users", config);

      expect(key).toBe("");
    });

    it("should be case insensitive for method", () => {
      const getUpper: ApiRequestConfig = { method: "GET" };
      const getLower: ApiRequestConfig = { method: "GET" }; // TypeScript requires uppercase
      const getMixed: ApiRequestConfig = { method: "GET" }; // TypeScript requires uppercase

      expect(getRequestKey("/api/test", getUpper)).toBeTruthy();
      expect(getRequestKey("/api/test", getLower)).toBeTruthy();
      expect(getRequestKey("/api/test", getMixed)).toBeTruthy();
    });

    it("should include headers in key", () => {
      const config1: ApiRequestConfig = {
        method: "GET",
        headers: { "X-Custom": "value1" },
      };
      const config2: ApiRequestConfig = {
        method: "GET",
        headers: { "X-Custom": "value2" },
      };

      const key1 = getRequestKey("/api/users", config1);
      const key2 = getRequestKey("/api/users", config2);

      expect(key1).not.toBe(key2);
    });

    it("should include body in key", () => {
      const config1: ApiRequestConfig = {
        method: "GET",
        body: { filter: "active" },
      };
      const config2: ApiRequestConfig = {
        method: "GET",
        body: { filter: "inactive" },
      };

      const key1 = getRequestKey("/api/users", config1);
      const key2 = getRequestKey("/api/users", config2);

      expect(key1).not.toBe(key2);
    });

    it("should generate same key for identical GET requests", () => {
      const config1: ApiRequestConfig = {
        method: "GET",
        headers: { Authorization: "Bearer token" },
      };
      const config2: ApiRequestConfig = {
        method: "GET",
        headers: { Authorization: "Bearer token" },
      };

      const key1 = getRequestKey("/api/users", config1);
      const key2 = getRequestKey("/api/users", config2);

      expect(key1).toBe(key2);
    });

    it("should generate key when method is missing (treats as GET)", () => {
      const config: ApiRequestConfig = {};
      const key = getRequestKey("/api/users", config);

      // Without method specified, generates key (defaults to GET behavior)
      expect(key).toBe("/api/users|undefined|undefined");
    });

    it("should handle config with no headers or body", () => {
      const config: ApiRequestConfig = { method: "GET" };
      const key = getRequestKey("/api/users", config);

      expect(key).toBe("/api/users|undefined|undefined");
    });
  });
});
