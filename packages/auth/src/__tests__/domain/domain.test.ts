/**
 * Domain Management Module Tests
 * Tests: getDomainStatus, initiateDomainVerification, checkDomainVerification, updateAutoJoin, removeDomain
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { DomainStatus } from "@/domain";

vi.mock("../../api/fetchers", () => ({
  publicFetch: vi.fn(),
  authenticatedFetch: vi.fn(),
}));

vi.mock("../../api/error-handlers", async () => {
  const { mockHandleApiError, ApiError } = await import("../setup/api-mocks");
  return {
    handleApiError: mockHandleApiError,
    ApiError,
  };
});

// Mock authStore
vi.mock("../../authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-token"),
}));

vi.mock("../../api/utils", () => {
  return {
    apiCall: vi.fn(async (fn, errorMap = {}) => {
      try {
        return await fn();
      } catch (error) {
        const { handleApiError } = await import("../../api/error-handlers");
        return handleApiError(error, errorMap);
      }
    }),
  };
});

// Import after mocks are set up
import { authenticatedFetch } from "../../api/fetchers";
import {
  getDomainStatus,
  initiateDomainVerification,
  checkDomainVerification,
  updateAutoJoin,
  removeDomain,
} from "@/domain";

describe("Domain Management Module", () => {
  const mockAuthenticatedFetch = authenticatedFetch as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDomainStatus", () => {
    it("should get domain status successfully", async () => {
      const mockResponse = {
        id: "domain123",
        domain: "company.com",
        status: DomainStatus.VERIFIED,
        verified_at: "2026-01-20T00:00:00Z",
        auto_join: true,
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await getDomainStatus("org123");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/domain",
        expect.any(Function),
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should return null when no domain is found (404)", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", { status: 404, endpoint: "memberships/org123/domain" }),
      );

      const result = await getDomainStatus("org123");

      expect(result).toBeNull();
    });

    it("should return pending domain with verification token", async () => {
      const mockResponse = {
        id: "domain123",
        domain: "company.com",
        status: DomainStatus.PENDING,
        verification_token: "rixl-domain-verification=abc123",
        expires_at: "2026-01-30T00:00:00Z",
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await getDomainStatus("org123");

      expect(result).toEqual(mockResponse);
      expect(result?.verification_token).toBe("rixl-domain-verification=abc123");
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", { status: 401, endpoint: "memberships/org123/domain" }),
      );

      await expect(getDomainStatus("org123")).rejects.toThrow(
        "Not authorized to view domain settings",
      );
    });
  });

  describe("initiateDomainVerification", () => {
    it("should initiate domain verification successfully", async () => {
      const mockResponse = {
        id: "domain123",
        domain: "company.com",
        status: DomainStatus.PENDING,
        verification_token: "rixl-domain-verification=abc123",
        expires_at: "2026-01-30T00:00:00Z",
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await initiateDomainVerification("org123", "company.com");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/domain",
        expect.any(Function),
        expect.objectContaining({
          method: "POST",
          body: { domain: "company.com" },
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle validation error for invalid domain format", async () => {
      // Validation happens client-side before API call
      await expect(initiateDomainVerification("org123", "invalid")).rejects.toThrow(
        "Invalid domain format",
      );
    });

    it("should handle bad request error for public domain", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Bad Request", { status: 400, endpoint: "memberships/org123/domain" }),
      );

      // Valid format but rejected by API (e.g., public domain like gmail.com)
      await expect(initiateDomainVerification("org123", "gmail.com")).rejects.toThrow(
        "Invalid domain format or public domains like gmail.com are not allowed",
      );
    });

    it("should handle forbidden error for non-enterprise plan", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Forbidden", { status: 403, endpoint: "memberships/org123/domain" }),
      );

      await expect(initiateDomainVerification("org123", "company.com")).rejects.toThrow(
        "Domain verification requires an Enterprise plan",
      );
    });

    it("should handle conflict error for already claimed domain", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Conflict", { status: 409, endpoint: "memberships/org123/domain" }),
      );

      await expect(initiateDomainVerification("org123", "claimed.com")).rejects.toThrow(
        "This domain is already claimed by another organization",
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", { status: 401, endpoint: "memberships/org123/domain" }),
      );

      await expect(initiateDomainVerification("org123", "company.com")).rejects.toThrow(
        "Not authorized to configure domain settings",
      );
    });
  });

  describe("checkDomainVerification", () => {
    it("should check domain verification successfully and return verified status", async () => {
      const mockResponse = {
        id: "domain123",
        domain: "company.com",
        status: DomainStatus.VERIFIED,
        verified_at: "2026-01-20T00:00:00Z",
        auto_join: false,
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await checkDomainVerification("org123");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/domain/verification",
        expect.any(Function),
        expect.objectContaining({ method: "POST" }),
      );
      expect(result).toEqual(mockResponse);
      expect(result.status).toBe(DomainStatus.VERIFIED);
    });

    it("should return pending status when DNS check fails", async () => {
      const mockResponse = {
        id: "domain123",
        domain: "company.com",
        status: DomainStatus.PENDING,
        verification_token: "rixl-domain-verification=abc123",
        expires_at: "2026-01-30T00:00:00Z",
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await checkDomainVerification("org123");

      expect(result.status).toBe(DomainStatus.PENDING);
    });

    it("should handle bad request error for DNS lookup failure", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Bad Request", {
          status: 400,
          endpoint: "memberships/org123/domain/verification",
        }),
      );

      await expect(checkDomainVerification("org123")).rejects.toThrow(
        "DNS verification failed. Please check your DNS settings and try again",
      );
    });

    it("should handle not found error when no pending request exists", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", {
          status: 404,
          endpoint: "memberships/org123/domain/verification",
        }),
      );

      await expect(checkDomainVerification("org123")).rejects.toThrow(
        "No pending domain verification request found",
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", { status: 401, endpoint: "memberships/org123/domain/verify" }),
      );

      await expect(checkDomainVerification("org123")).rejects.toThrow(
        "Not authorized to check domain verification",
      );
    });

    it("should handle forbidden error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Forbidden", { status: 403, endpoint: "memberships/org123/domain/verify" }),
      );

      await expect(checkDomainVerification("org123")).rejects.toThrow(
        "You do not have permission to verify this domain",
      );
    });
  });

  describe("updateAutoJoin", () => {
    it("should enable auto-join successfully", async () => {
      const mockResponse = { enabled: true };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await updateAutoJoin("org123", true);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/domain/auto-join",
        expect.any(Function),
        expect.objectContaining({
          method: "PUT",
          body: { enabled: true },
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should disable auto-join successfully", async () => {
      const mockResponse = { enabled: false };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await updateAutoJoin("org123", false);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/domain/auto-join",
        expect.any(Function),
        expect.objectContaining({
          method: "PUT",
          body: { enabled: false },
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle forbidden error for non-enterprise plan", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Forbidden", { status: 403, endpoint: "memberships/org123/domain/auto-join" }),
      );

      await expect(updateAutoJoin("org123", true)).rejects.toThrow(
        "Auto-join settings require an Enterprise plan",
      );
    });

    it("should handle not found error when no verified domain exists", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", { status: 404, endpoint: "memberships/org123/domain/auto-join" }),
      );

      await expect(updateAutoJoin("org123", true)).rejects.toThrow(
        "No verified domain found. Please verify your domain first",
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", {
          status: 401,
          endpoint: "memberships/org123/domain/autojoin",
        }),
      );

      await expect(updateAutoJoin("org123", true)).rejects.toThrow(
        "Not authorized to update auto-join settings",
      );
    });
  });

  describe("removeDomain", () => {
    it("should remove domain successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await removeDomain("org123");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/domain",
        expect.any(Function),
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("should handle not found error when no verified domain exists", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", { status: 404, endpoint: "memberships/org123/domain" }),
      );

      await expect(removeDomain("org123")).rejects.toThrow("No verified domain found to remove");
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", { status: 401, endpoint: "memberships/org123/domain" }),
      );

      await expect(removeDomain("org123")).rejects.toThrow("Not authorized to remove domain");
    });

    it("should work with different organization IDs", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await removeDomain("org456");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org456/domain",
        expect.any(Function),
        expect.any(Object),
      );
    });
  });
});
