/**
 * API base fetch tests
 * Tests: baseFetch with deduplication and error handling
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { baseFetch } from "@/api/base.ts";
import { ApiError } from "@/api/types.ts";
import { pendingRequests } from "@/api/deduplication.ts";
import { HTTPError } from "ky";

describe("baseFetch", () => {
  beforeEach(() => {
    pendingRequests.clear();
    vi.clearAllMocks();
  });

  it("should fetch data successfully", async () => {
    const mockKyInstance = vi.fn().mockResolvedValue({
      headers: new Map([["content-type", "application/json"]]),
      json: vi.fn().mockResolvedValue({ data: "success" }),
    });
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    const result = await baseFetch("/test", { method: "GET" }, getKyInstance);

    expect(result).toEqual({ data: "success" });
    expect(mockKyInstance).toHaveBeenCalledWith("test", expect.objectContaining({ method: "get" }));
  });

  it("should handle POST requests with body", async () => {
    const mockKyInstance = vi.fn().mockResolvedValue({
      headers: new Map([["content-type", "application/json"]]),
      json: vi.fn().mockResolvedValue({ created: true }),
    });
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    await baseFetch("/test", { method: "POST", body: { name: "test" } }, getKyInstance);

    expect(mockKyInstance).toHaveBeenCalledWith(
      "test",
      expect.objectContaining({
        method: "post",
        json: { name: "test" },
      }),
    );
  });

  it("should handle empty responses", async () => {
    const mockKyInstance = vi.fn().mockResolvedValue({
      headers: new Map([["content-type", "text/plain"]]),
      json: vi.fn(),
    });
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    const result = await baseFetch("/test", { method: "DELETE" }, getKyInstance);

    expect(result).toBeUndefined();
  });

  it("should deduplicate concurrent requests", async () => {
    const mockKyInstance = vi.fn().mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return {
        headers: new Map([["content-type", "application/json"]]),
        json: vi.fn().mockResolvedValue({ data: "test" }),
      };
    });
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    const [result1, result2, result3] = await Promise.all([
      baseFetch("/test", { method: "GET" }, getKyInstance),
      baseFetch("/test", { method: "GET" }, getKyInstance),
      baseFetch("/test", { method: "GET" }, getKyInstance),
    ]);

    expect(result1).toEqual({ data: "test" });
    expect(result2).toEqual({ data: "test" });
    expect(result3).toEqual({ data: "test" });
    expect(mockKyInstance).toHaveBeenCalledTimes(1); // Only called once due to deduplication
  });

  it("should handle HTTPError and convert to ApiError", async () => {
    const mockResponse = {
      status: 404,
      json: vi.fn().mockResolvedValue({ error: "Not found" }),
    };
    const httpError = new HTTPError(mockResponse as any, {} as any, {} as any);
    const mockKyInstance = vi.fn().mockRejectedValue(httpError);
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    await expect(baseFetch("/test", { method: "GET" }, getKyInstance)).rejects.toThrow(ApiError);

    try {
      await baseFetch("/test", { method: "GET" }, getKyInstance);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(404);
      expect((error as ApiError).endpoint).toBe("/test");
    }
  });

  it("should handle HTTPError with no JSON body", async () => {
    const mockResponse = {
      status: 500,
      json: vi.fn().mockRejectedValue(new Error("No JSON")),
    };
    const httpError = new HTTPError(mockResponse as any, {} as any, {} as any);
    const mockKyInstance = vi.fn().mockRejectedValue(httpError);
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    await expect(baseFetch("/test", { method: "GET" }, getKyInstance)).rejects.toThrow(ApiError);

    try {
      await baseFetch("/test", { method: "GET" }, getKyInstance);
    } catch (error) {
      expect((error as ApiError).message).toContain("Request failed with status 500");
    }
  });

  it("should pass through non-HTTP errors", async () => {
    const customError = new Error("Network error");
    const mockKyInstance = vi.fn().mockRejectedValue(customError);
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    await expect(baseFetch("/test", { method: "GET" }, getKyInstance)).rejects.toThrow(
      "Network error",
    );
  });

  it("should include headers in request", async () => {
    const mockKyInstance = vi.fn().mockResolvedValue({
      headers: new Map([["content-type", "application/json"]]),
      json: vi.fn().mockResolvedValue({ data: "test" }),
    });
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    await baseFetch("/test", { method: "GET", headers: { "X-Custom": "value" } }, getKyInstance);

    expect(mockKyInstance).toHaveBeenCalledWith(
      "test",
      expect.objectContaining({
        headers: { "X-Custom": "value" },
      }),
    );
  });

  it("should handle string body by parsing to JSON", async () => {
    const mockKyInstance = vi.fn().mockResolvedValue({
      headers: new Map([["content-type", "application/json"]]),
      json: vi.fn().mockResolvedValue({ success: true }),
    });
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    await baseFetch("/test", { method: "POST", body: '{"name":"test"}' }, getKyInstance);

    expect(mockKyInstance).toHaveBeenCalledWith(
      "test",
      expect.objectContaining({
        json: { name: "test" },
      }),
    );
  });

  it("should clean up pending requests after completion", async () => {
    const mockKyInstance = vi.fn().mockResolvedValue({
      headers: new Map([["content-type", "application/json"]]),
      json: vi.fn().mockResolvedValue({ data: "test" }),
    });
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    expect(pendingRequests.size).toBe(0);

    await baseFetch("/test", { method: "GET" }, getKyInstance);

    expect(pendingRequests.size).toBe(0); // Should be cleaned up
  });

  it("should support retry configuration", async () => {
    const mockKyInstance = vi.fn().mockResolvedValue({
      headers: new Map([["content-type", "application/json"]]),
      json: vi.fn().mockResolvedValue({ data: "test" }),
    });
    const getKyInstance = vi.fn().mockResolvedValue(mockKyInstance);

    await baseFetch("/test", { method: "GET", retry: 3 }, getKyInstance);

    expect(mockKyInstance).toHaveBeenCalledWith(
      "test",
      expect.objectContaining({
        retry: 3,
      }),
    );
  });
});
