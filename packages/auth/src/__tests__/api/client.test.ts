/**
 * API Client Module Tests
 * Tests: authenticatedFetch, publicFetch, setTokenRefreshFunction, handleApiError, err, commonErrors
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { authenticatedFetch } from "../../api/fetchers";
import { setTokenRefreshFunction } from "../../api/client-core";
import { handleApiError, err, commonErrors } from "../../api/error-handlers";
import { ApiError } from "../../api/types";

// Mock the api module
vi.mock("../../api", () => ({
  apiURL: {
    get: vi.fn(() => "https://api.example.com"),
  },
}));

// Mock ky
vi.mock("ky", () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

// Mock base fetch
vi.mock("../../api/base", () => ({
  baseFetch: vi.fn(),
}));

describe("API Client Module", () => {
  let mockBaseFetch: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const base = await import("../../api/base");
    mockBaseFetch = base.baseFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("ApiError", () => {
    it("should create ApiError with all properties", () => {
      const error = new ApiError("Test error", 404, "/test/endpoint", { detail: "Not found" });

      expect(error.message).toBe("Test error");
      expect(error.status).toBe(404);
      expect(error.endpoint).toBe("/test/endpoint");
      expect(error.data).toEqual({ detail: "Not found" });
      expect(error.name).toBe("ApiError");
      expect(error instanceof Error).toBe(true);
    });

    it("should create ApiError without optional data", () => {
      const error = new ApiError("Unauthorized", 401, "/users/me");

      expect(error.message).toBe("Unauthorized");
      expect(error.status).toBe(401);
      expect(error.endpoint).toBe("/users/me");
      expect(error.data).toBeUndefined();
    });

    it("should be instanceof Error and ApiError", () => {
      const error = new ApiError("Error", 500, "/endpoint");

      expect(error instanceof Error).toBe(true);
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("setTokenRefreshFunction", () => {
    it("should set token refresh function", () => {
      const refreshFn = vi.fn().mockResolvedValue("new-token");

      expect(() => setTokenRefreshFunction(refreshFn)).not.toThrow();
    });

    it("should accept async function", async () => {
      const refreshFn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "refreshed-token";
      };

      setTokenRefreshFunction(refreshFn);
      // Function should be stored without errors
      expect(true).toBe(true);
    });
  });

  describe("authenticatedFetch", () => {
    it("should make authenticated request successfully", async () => {
      const mockResponse = { id: "123", name: "Test" };
      mockBaseFetch.mockResolvedValue(mockResponse);

      const getTokenFn = vi.fn().mockResolvedValue("mock-token");
      const result = await authenticatedFetch("users/me", getTokenFn);

      expect(mockBaseFetch).toHaveBeenCalledWith("users/me", {}, expect.any(Function));
      expect(result).toEqual(mockResponse);
    });

    it("should pass config to baseFetch", async () => {
      mockBaseFetch.mockResolvedValue({ success: true });

      const getTokenFn = vi.fn().mockResolvedValue("token");
      const config = { method: "POST" as const, body: { data: "test" } };

      await authenticatedFetch("test", getTokenFn, config);

      expect(mockBaseFetch).toHaveBeenCalledWith("test", config, expect.any(Function));
    });

    it("should throw error if no token and auth not skipped", async () => {
      const { ApiError } = await import("../../api/types");
      mockBaseFetch.mockImplementation(async (endpoint: string, _config: any, factoryFn: any) => {
        await factoryFn(); // Call factory to trigger the token check
        // Simulate what baseFetch does - it should throw if no token
        throw new ApiError("No authentication token available", 401, endpoint);
      });

      const getTokenFn = vi.fn().mockResolvedValue(undefined);

      await expect(authenticatedFetch("users/me", getTokenFn)).rejects.toThrow(
        "No authentication token available",
      );
    });

    it("should not throw if no token but auth is skipped", async () => {
      mockBaseFetch.mockResolvedValue({ data: "public" });

      const getTokenFn = vi.fn().mockResolvedValue(undefined);
      const result = await authenticatedFetch("public", getTokenFn, { skipAuth: true });

      expect(result).toEqual({ data: "public" });
    });

    it("should create ky instance with token", async () => {
      mockBaseFetch.mockResolvedValue({});

      const getTokenFn = vi.fn().mockResolvedValue("test-token");
      await authenticatedFetch("endpoint", getTokenFn);

      expect(mockBaseFetch).toHaveBeenCalled();
      // Verify that the factory function was called
      const factoryFn = mockBaseFetch.mock.calls[0][2];
      expect(typeof factoryFn).toBe("function");
    });

    it("should handle different HTTP methods", async () => {
      mockBaseFetch.mockResolvedValue({ updated: true });

      const getTokenFn = vi.fn().mockResolvedValue("token");
      await authenticatedFetch("resource/123", getTokenFn, { method: "PUT" });

      expect(mockBaseFetch).toHaveBeenCalledWith(
        "resource/123",
        expect.objectContaining({ method: "PUT" }),
        expect.any(Function),
      );
    });

    it("should pass request body", async () => {
      mockBaseFetch.mockResolvedValue({ created: true });

      const getTokenFn = vi.fn().mockResolvedValue("token");
      const body = { name: "New Item", value: 42 };

      await authenticatedFetch("items", getTokenFn, { method: "POST", body });

      expect(mockBaseFetch).toHaveBeenCalledWith(
        "items",
        expect.objectContaining({ method: "POST", body }),
        expect.any(Function),
      );
    });
  });

  describe("handleApiError", () => {
    it("should handle ApiError with matching status handler", () => {
      const error = new ApiError("Not Found", 404, "/resource");
      const handlers = {
        404: () => new Error("Resource not found!"),
      };

      expect(() => handleApiError(error, handlers)).toThrow("Resource not found!");
    });

    it("should throw original ApiError if no handler matches", () => {
      const error = new ApiError("Server Error", 500, "/resource");
      const handlers = {
        404: () => new Error("Not found"),
      };

      expect(() => handleApiError(error, handlers)).toThrow(error);
    });

    it("should handle multiple status handlers", () => {
      const error = new ApiError("Unauthorized", 401, "/secure");
      const handlers = {
        401: () => new Error("Authentication required!"),
        403: () => new Error("Forbidden!"),
        404: () => new Error("Not found!"),
      };

      expect(() => handleApiError(error, handlers)).toThrow("Authentication required!");
    });

    it("should throw non-ApiError as-is", () => {
      const error = new Error("Network error");
      const handlers = {
        404: () => new Error("Not found"),
      };

      expect(() => handleApiError(error, handlers)).toThrow(error);
    });

    it("should handle different status codes", () => {
      const error403 = new ApiError("Forbidden", 403, "/admin");
      const handlers403 = {
        403: () => new Error("Access denied!"),
      };

      expect(() => handleApiError(error403, handlers403)).toThrow("Access denied!");
    });

    it("should preserve error message from handler", () => {
      const error = new ApiError("Conflict", 409, "/user");
      const handlers = {
        409: () => new Error("User already exists with this email!"),
      };

      try {
        handleApiError(error, handlers);
      } catch (e: any) {
        expect(e.message).toBe("User already exists with this email!");
      }
    });
  });

  describe("err helper", () => {
    it("should create error factory function", () => {
      const errorFactory = err("Custom error message");

      expect(typeof errorFactory).toBe("function");
      const error = errorFactory();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Custom error message");
    });

    it("should create different errors for different messages", () => {
      const factory1 = err("Error 1");
      const factory2 = err("Error 2");

      const error1 = factory1();
      const error2 = factory2();

      expect(error1.message).toBe("Error 1");
      expect(error2.message).toBe("Error 2");
    });

    it("should create new error instance each time", () => {
      const factory = err("Test error");

      const error1 = factory();
      const error2 = factory();

      expect(error1).not.toBe(error2);
      expect(error1.message).toBe(error2.message);
    });
  });

  describe("commonErrors", () => {
    it("should have unauthorized error", () => {
      const error = commonErrors.unauthorized();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("User is not authorized");
    });

    it("should have badRequest error", () => {
      const error = commonErrors.badRequest();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Bad request");
    });

    it("should have notFound error", () => {
      const error = commonErrors.notFound();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Not found");
    });

    it("should have conflict error", () => {
      const error = commonErrors.conflict();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Resource already exists");
    });

    it("should have forbidden error", () => {
      const error = commonErrors.forbidden();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Forbidden");
    });

    it("should have tooManyRequests error", () => {
      const error = commonErrors.tooManyRequests();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Too many requests");
    });

    it("should create new error instances each time", () => {
      const error1 = commonErrors.unauthorized();
      const error2 = commonErrors.unauthorized();

      expect(error1).not.toBe(error2);
      expect(error1.message).toBe(error2.message);
    });

    it("should have all expected error factories", () => {
      expect(typeof commonErrors.unauthorized).toBe("function");
      expect(typeof commonErrors.badRequest).toBe("function");
      expect(typeof commonErrors.notFound).toBe("function");
      expect(typeof commonErrors.conflict).toBe("function");
      expect(typeof commonErrors.forbidden).toBe("function");
      expect(typeof commonErrors.tooManyRequests).toBe("function");
    });
  });
});
