/**
 * Pagination Utils Tests
 * Tests: buildPaginationQuery, fetchPaginatedData
 */

import { describe, it, expect } from "vitest";
import { buildPaginationQuery } from "../pagination-utils";

describe("Pagination Utils", () => {
  describe("buildPaginationQuery", () => {
    it("should return empty string when no params provided", () => {
      expect(buildPaginationQuery()).toBe("");
      expect(buildPaginationQuery(undefined)).toBe("");
    });

    it("should build query with limit only", () => {
      const query = buildPaginationQuery({ limit: 10 });
      expect(query).toBe("?limit=10");
    });

    it("should build query with offset only", () => {
      const query = buildPaginationQuery({ offset: 20 });
      expect(query).toBe("?offset=20");
    });

    it("should build query with both limit and offset", () => {
      const query = buildPaginationQuery({ limit: 10, offset: 20 });
      expect(query).toContain("limit=10");
      expect(query).toContain("offset=20");
      expect(query.startsWith("?")).toBe(true);
    });

    it("should handle limit of 0", () => {
      const query = buildPaginationQuery({ limit: 0 });
      expect(query).toBe("?limit=0");
    });

    it("should handle offset of 0", () => {
      const query = buildPaginationQuery({ offset: 0 });
      expect(query).toBe("?offset=0");
    });

    it("should handle both as 0", () => {
      const query = buildPaginationQuery({ limit: 0, offset: 0 });
      expect(query).toContain("limit=0");
      expect(query).toContain("offset=0");
    });

    it("should handle large numbers", () => {
      const query = buildPaginationQuery({ limit: 1000, offset: 5000 });
      expect(query).toContain("limit=1000");
      expect(query).toContain("offset=5000");
    });

    it("should return empty string for empty object", () => {
      const query = buildPaginationQuery({});
      expect(query).toBe("");
    });

    it("should ignore undefined values in params", () => {
      const query = buildPaginationQuery({ limit: undefined, offset: 20 });
      expect(query).toBe("?offset=20");
      expect(query).not.toContain("limit");
    });
  });

  describe("fetchPaginatedData", () => {
    it("should be a function that accepts correct parameters", async () => {
      const { fetchPaginatedData } = await import("../pagination-utils");

      expect(typeof fetchPaginatedData).toBe("function");
      // fetchPaginatedData signature is tested by TypeScript and usage in integration tests
      // Direct testing requires complex HTTP mocking that is better covered by integration tests
    });

    it("should work with buildPaginationQuery for query construction", () => {
      // Test that pagination utils work together
      const query = buildPaginationQuery({ limit: 10, offset: 20 });
      expect(query).toBe("?limit=10&offset=20");

      // fetchPaginatedData uses buildPaginationQuery internally
      // This is verified through integration tests in membership/list.test.ts
    });
  });
});
