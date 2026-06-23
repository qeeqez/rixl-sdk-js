/**
 * Blog Subscription Module Tests
 * Tests: getBlogSubscriptionStatus, subscribeToBlog, unsubscribeFromBlog
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/types";

vi.mock("../../api/fetchers", () => ({
  authenticatedFetch: vi.fn(),
}));

vi.mock("../../authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-token"),
}));

vi.mock("../../api/error-handlers", async () => {
  const { mockHandleApiError } = await import("../setup/api-mocks");
  return {
    handleApiError: mockHandleApiError,
  };
});

vi.mock("../../api/utils", () => ({
  apiCall: vi.fn(async <T>(fn: () => Promise<T>, errorMap: Record<number, () => Error> = {}) => {
    try {
      return await fn();
    } catch (error) {
      const { handleApiError } = await import("../../api/error-handlers");
      return handleApiError(error, errorMap);
    }
  }),
}));

import { authenticatedFetch } from "../../api/fetchers";
import {
  getBlogSubscriptionStatus,
  subscribeToBlog,
  unsubscribeFromBlog,
  type BlogSubscriptionStatus,
} from "@/blog";

describe("Blog subscription API", () => {
  const mockAuthenticatedFetch = vi.mocked(authenticatedFetch);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches current blog subscription status", async () => {
    const response: BlogSubscriptionStatus = {
      subscribed: true,
      subscribed_at: "2026-04-23T12:00:00Z",
    };
    mockAuthenticatedFetch.mockResolvedValue(response);

    const result = await getBlogSubscriptionStatus();

    expect(mockAuthenticatedFetch).toHaveBeenCalledWith("blog/subscription", expect.any(Function), {
      method: "GET",
    });
    expect(result).toEqual(response);
  });

  it("subscribes the current user to blog updates", async () => {
    mockAuthenticatedFetch.mockResolvedValue(undefined);

    await subscribeToBlog();

    expect(mockAuthenticatedFetch).toHaveBeenCalledWith("blog/subscribe", expect.any(Function), {
      method: "POST",
    });
  });

  it("unsubscribes the current user from blog updates", async () => {
    mockAuthenticatedFetch.mockResolvedValue(undefined);

    await unsubscribeFromBlog();

    expect(mockAuthenticatedFetch).toHaveBeenCalledWith("blog/unsubscribe", expect.any(Function), {
      method: "POST",
    });
  });

  it("maps unauthorized errors for subscription reads", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Unauthorized", { status: 401, endpoint: "blog/subscription" }),
    );

    await expect(getBlogSubscriptionStatus()).rejects.toThrow(
      "User is not authorized to manage blog subscription",
    );
  });

  it("maps server errors for subscribe failures", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Server Error", { status: 500, endpoint: "blog/subscribe" }),
    );

    await expect(subscribeToBlog()).rejects.toThrow("Failed to subscribe to blog updates");
  });

  it("maps forbidden errors for subscribe failures", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Forbidden", { status: 403, endpoint: "blog/subscribe" }),
    );

    await expect(subscribeToBlog()).rejects.toThrow("Account is inactive");
  });

  it("maps rate-limit errors for subscribe failures", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Too Many Requests", { status: 429, endpoint: "blog/subscribe" }),
    );

    await expect(subscribeToBlog()).rejects.toThrow("Too many requests - please try again later");
  });

  it("maps unauthorized errors for subscribe failures", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Unauthorized", { status: 401, endpoint: "blog/subscribe" }),
    );

    await expect(subscribeToBlog()).rejects.toThrow(
      "User is not authorized to manage blog subscription",
    );
  });

  it("maps forbidden errors for subscription reads", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Forbidden", { status: 403, endpoint: "blog/subscription" }),
    );

    await expect(getBlogSubscriptionStatus()).rejects.toThrow("Account is inactive");
  });

  it("maps rate-limit errors for subscription reads", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Too Many Requests", { status: 429, endpoint: "blog/subscription" }),
    );

    await expect(getBlogSubscriptionStatus()).rejects.toThrow(
      "Too many requests - please try again later",
    );
  });

  it("maps unauthorized errors for unsubscribe failures", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Unauthorized", { status: 401, endpoint: "blog/unsubscribe" }),
    );

    await expect(unsubscribeFromBlog()).rejects.toThrow(
      "User is not authorized to manage blog subscription",
    );
  });

  it("maps forbidden errors for unsubscribe failures", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Forbidden", { status: 403, endpoint: "blog/unsubscribe" }),
    );

    await expect(unsubscribeFromBlog()).rejects.toThrow("Account is inactive");
  });

  it("maps rate-limit errors for unsubscribe failures", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Too Many Requests", { status: 429, endpoint: "blog/unsubscribe" }),
    );

    await expect(unsubscribeFromBlog()).rejects.toThrow(
      "Too many requests - please try again later",
    );
  });

  it("maps server errors for unsubscribe failures", async () => {
    mockAuthenticatedFetch.mockRejectedValue(
      new ApiError("Server Error", { status: 500, endpoint: "blog/unsubscribe" }),
    );

    await expect(unsubscribeFromBlog()).rejects.toThrow("Failed to unsubscribe from blog updates");
  });
});
