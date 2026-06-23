/**
 * Pagination Utils Complete Coverage Tests
 * Tests: fetchPaginatedData with mocked API calls
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchPaginatedData } from "../pagination-utils";
import * as clientModule from "../api/fetchers";
import * as utilsModule from "../api/utils";
import { HTTP_STATUS } from "../constants";

describe("Pagination Utils - Complete Coverage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchPaginatedData - Lines 55-63", () => {
    it("should call buildPaginationQuery and construct full endpoint", async () => {
      // Mock the dependencies
      const mockGetToken = vi.fn().mockResolvedValue("test-token");
      const mockResponse = {
        data: { items: ["item1", "item2"] },
        pagination: { limit: 10, offset: 0, total: 2 },
      };

      // Mock authenticatedFetch to return our response
      const authenticatedFetchSpy = vi
        .spyOn(clientModule, "authenticatedFetch")
        .mockResolvedValue(mockResponse);

      // Mock apiCall to just execute the function
      const apiCallSpy = vi.spyOn(utilsModule, "apiCall").mockImplementation(async (fn) => {
        return await fn();
      });

      // Call fetchPaginatedData
      const result = await fetchPaginatedData("/api/test", mockGetToken, { limit: 10, offset: 0 });

      // Verify buildPaginationQuery was used (line 56)
      expect(authenticatedFetchSpy).toHaveBeenCalledWith(
        "/api/test?limit=10&offset=0",
        mockGetToken,
        { method: "GET" },
      );

      // Verify response.data is returned (line 59)
      expect(result).toEqual({ items: ["item1", "item2"] });

      // Verify apiCall was called with correct error handler (lines 54-64)
      expect(apiCallSpy).toHaveBeenCalled();
    });

    it("should handle undefined pagination params", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("test-token");
      const mockResponse = {
        data: { items: [] },
        pagination: { limit: 10, offset: 0, total: 0 },
      };

      const authenticatedFetchSpy = vi
        .spyOn(clientModule, "authenticatedFetch")
        .mockResolvedValue(mockResponse);
      vi.spyOn(utilsModule, "apiCall").mockImplementation(async (fn) => await fn());

      // Call without pagination params
      const result = await fetchPaginatedData("/api/test", mockGetToken);

      // Should call endpoint without query string (line 57)
      expect(authenticatedFetchSpy).toHaveBeenCalledWith("/api/test", mockGetToken, {
        method: "GET",
      });

      expect(result).toEqual({ items: [] });
    });

    it("should use custom unauthorized message in error handler", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("test-token");
      const customMessage = "Custom unauthorized message";

      // Mock apiCall to expose the error handlers
      let errorHandlers: any = {};
      vi.spyOn(utilsModule, "apiCall").mockImplementation(async (fn, handlers) => {
        errorHandlers = handlers;
        return await fn();
      });

      const mockResponse = {
        data: { items: [] },
        pagination: { limit: 10, offset: 0, total: 0 },
      };
      vi.spyOn(clientModule, "authenticatedFetch").mockResolvedValue(mockResponse);

      // Call with custom unauthorized message
      await fetchPaginatedData("/api/test", mockGetToken, undefined, customMessage);

      // Verify error handler was set with custom message (line 62)
      expect(errorHandlers[HTTP_STATUS.UNAUTHORIZED]).toBeDefined();
      const error = errorHandlers[HTTP_STATUS.UNAUTHORIZED]();
      expect(error.message).toBe(customMessage);
    });

    it("should use default unauthorized message when not provided", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      let errorHandlers: any = {};
      vi.spyOn(utilsModule, "apiCall").mockImplementation(async (fn, handlers) => {
        errorHandlers = handlers;
        return await fn();
      });

      const mockResponse = {
        data: { items: [] },
        pagination: { limit: 10, offset: 0, total: 0 },
      };
      vi.spyOn(clientModule, "authenticatedFetch").mockResolvedValue(mockResponse);

      // Call without custom message
      await fetchPaginatedData("/api/test", mockGetToken);

      // Verify default message is used
      const error = errorHandlers[HTTP_STATUS.UNAUTHORIZED]();
      expect(error.message).toBe("User is not authorized!");
    });

    it("should construct correct full endpoint with query string", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("test-token");
      const mockResponse = {
        data: { users: [] },
        pagination: { limit: 20, offset: 40, total: 100 },
      };

      const authenticatedFetchSpy = vi
        .spyOn(clientModule, "authenticatedFetch")
        .mockResolvedValue(mockResponse);
      vi.spyOn(utilsModule, "apiCall").mockImplementation(async (fn) => await fn());

      await fetchPaginatedData("/api/users", mockGetToken, { limit: 20, offset: 40 });

      // Verify line 57: const fullEndpoint = `${endpoint}${queryString}`
      expect(authenticatedFetchSpy).toHaveBeenCalledWith(
        "/api/users?limit=20&offset=40",
        mockGetToken,
        { method: "GET" },
      );
    });

    it("should extract and return response.data", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("test-token");
      const expectedData = {
        id: "123",
        name: "Test Item",
        nested: { value: "nested data" },
      };
      const mockResponse = {
        data: expectedData,
        pagination: { limit: 1, offset: 0, total: 1 },
      };

      vi.spyOn(clientModule, "authenticatedFetch").mockResolvedValue(mockResponse);
      vi.spyOn(utilsModule, "apiCall").mockImplementation(async (fn) => await fn());

      const result = await fetchPaginatedData("/api/item", mockGetToken);

      // Verify line 59: return response.data
      expect(result).toEqual(expectedData);
      expect(result).not.toHaveProperty("pagination");
    });

    it("should pass method GET to authenticatedFetch", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("test-token");
      const mockResponse = {
        data: [],
        pagination: { limit: 10, offset: 0, total: 0 },
      };

      const authenticatedFetchSpy = vi
        .spyOn(clientModule, "authenticatedFetch")
        .mockResolvedValue(mockResponse);
      vi.spyOn(utilsModule, "apiCall").mockImplementation(async (fn) => await fn());

      await fetchPaginatedData("/api/test", mockGetToken);

      // Verify line 58: method: "GET"
      expect(authenticatedFetchSpy).toHaveBeenCalledWith(expect.any(String), expect.any(Function), {
        method: "GET",
      });
    });

    it("should work with different pagination parameter combinations", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("test-token");
      const mockResponse = {
        data: [],
        pagination: { limit: 10, offset: 0, total: 0 },
      };

      const authenticatedFetchSpy = vi
        .spyOn(clientModule, "authenticatedFetch")
        .mockResolvedValue(mockResponse);
      vi.spyOn(utilsModule, "apiCall").mockImplementation(async (fn) => await fn());

      // Test with only limit
      await fetchPaginatedData("/api/test", mockGetToken, { limit: 5 });
      expect(authenticatedFetchSpy).toHaveBeenCalledWith("/api/test?limit=5", mockGetToken, {
        method: "GET",
      });

      authenticatedFetchSpy.mockClear();

      // Test with only offset
      await fetchPaginatedData("/api/test", mockGetToken, { offset: 10 });
      expect(authenticatedFetchSpy).toHaveBeenCalledWith("/api/test?offset=10", mockGetToken, {
        method: "GET",
      });

      authenticatedFetchSpy.mockClear();

      // Test with both
      await fetchPaginatedData("/api/test", mockGetToken, { limit: 5, offset: 10 });
      expect(authenticatedFetchSpy).toHaveBeenCalledWith(
        "/api/test?limit=5&offset=10",
        mockGetToken,
        { method: "GET" },
      );
    });
  });

  describe("Integration with apiCall error handling", () => {
    it("should handle unauthorized errors through apiCall", async () => {
      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      // Mock authenticatedFetch to throw 401 error
      vi.spyOn(clientModule, "authenticatedFetch").mockRejectedValue({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Unauthorized",
      });

      // Mock apiCall to actually handle the error
      vi.spyOn(utilsModule, "apiCall").mockImplementation(async (fn, handlers) => {
        try {
          return await fn();
        } catch (error: any) {
          if (handlers && error.status === HTTP_STATUS.UNAUTHORIZED) {
            const handler = handlers[HTTP_STATUS.UNAUTHORIZED];
            if (handler) throw handler();
          }
          throw error;
        }
      });

      // Should throw custom error
      await expect(
        fetchPaginatedData("/api/test", mockGetToken, undefined, "Custom error"),
      ).rejects.toThrow("Custom error");
    });
  });
});
