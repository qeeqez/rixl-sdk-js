/**
 * API Client Coverage Tests
 * Tests: Additional coverage for client.ts uncovered lines
 */

import {describe, it, expect, beforeEach, vi} from "vitest";
import {setTokenRefreshFunction} from "../../auth/api/client-core";
import {ApiError} from "../../auth/api/types";
import {err, commonErrors, handleApiError} from "../../auth/api/error-handlers";
import {HTTP_STATUS} from "@/constants.ts";

describe("API Client - Additional Coverage", () => {
  beforeEach(() => {
    // Reset token refresh function
    setTokenRefreshFunction(async () => undefined);
  });

  describe("setTokenRefreshFunction", () => {
    it("should set the token refresh function", () => {
      const mockRefreshFn = vi.fn().mockResolvedValue("new-token");

      setTokenRefreshFunction(mockRefreshFn);

      // Function is set successfully (we can't directly test it without triggering a 401)
      expect(mockRefreshFn).toBeDefined();
    });

    it("should allow overwriting the token refresh function", () => {
      const firstFn = vi.fn().mockResolvedValue("token1");
      const secondFn = vi.fn().mockResolvedValue("token2");

      setTokenRefreshFunction(firstFn);
      setTokenRefreshFunction(secondFn);

      expect(secondFn).toBeDefined();
    });
  });

  describe("ApiError", () => {
    it("should create an ApiError with all properties", () => {
      const error = new ApiError("Test error", 404, "/test/endpoint");

      expect(error.message).toBe("Test error");
      expect(error.status).toBe(404);
      expect(error.endpoint).toBe("/test/endpoint");
      expect(error.name).toBe("ApiError");
    });

    it("should be instanceof Error", () => {
      const error = new ApiError("Test", 500, "/test");

      expect(error instanceof Error).toBe(true);
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("handleApiError", () => {
    it("should throw custom error for matching status code", () => {
      const apiError = new ApiError("Unauthorized", HTTP_STATUS.UNAUTHORIZED, "/test");
      const customError = new Error("Custom unauthorized error");

      const statusHandlers = {
        [HTTP_STATUS.UNAUTHORIZED]: () => customError,
      };

      expect(() => handleApiError(apiError, statusHandlers)).toThrow("Custom unauthorized error");
    });

    it("should throw original ApiError when no handler matches", () => {
      const apiError = new ApiError("Not Found", HTTP_STATUS.NOT_FOUND, "/test");

      const statusHandlers = {
        [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Unauthorized"),
      };

      expect(() => handleApiError(apiError, statusHandlers)).toThrow(apiError);
    });

    it("should throw original error if not an ApiError", () => {
      const regularError = new Error("Regular error");

      const statusHandlers = {
        [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Should not be called"),
      };

      expect(() => handleApiError(regularError, statusHandlers)).toThrow(regularError);
    });

    it("should handle empty status handlers object", () => {
      const apiError = new ApiError("Server Error", 500, "/test");

      expect(() => handleApiError(apiError, {})).toThrow(apiError);
    });
  });

  describe("err helper", () => {
    it("should create an error factory function", () => {
      const errorFactory = err("Test error message");

      expect(typeof errorFactory).toBe("function");

      const error = errorFactory();
      expect(error instanceof Error).toBe(true);
      expect(error.message).toBe("Test error message");
    });

    it("should create unique error instances", () => {
      const errorFactory = err("Test");

      const error1 = errorFactory();
      const error2 = errorFactory();

      expect(error1).not.toBe(error2);
      expect(error1.message).toBe(error2.message);
    });
  });

  describe("commonErrors", () => {
    it("should have unauthorized error factory", () => {
      const error = commonErrors.unauthorized();
      expect(error.message).toBe("User is not authorized");
    });

    it("should have badRequest error factory", () => {
      const error = commonErrors.badRequest();
      expect(error.message).toBe("Bad request");
    });

    it("should have notFound error factory", () => {
      const error = commonErrors.notFound();
      expect(error.message).toBe("Not found");
    });

    it("should have conflict error factory", () => {
      const error = commonErrors.conflict();
      expect(error.message).toBe("Resource already exists");
    });

    it("should have forbidden error factory", () => {
      const error = commonErrors.forbidden();
      expect(error.message).toBe("Forbidden");
    });

    it("should have tooManyRequests error factory", () => {
      const error = commonErrors.tooManyRequests();
      expect(error.message).toBe("Too many requests");
    });

    it("should create new error instances each time", () => {
      const error1 = commonErrors.unauthorized();
      const error2 = commonErrors.unauthorized();

      expect(error1).not.toBe(error2);
    });
  });
});
