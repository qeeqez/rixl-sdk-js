import { describe, it, expect, beforeEach, vi } from "vitest";
import { DomainStatus } from "@/domain";
import * as initialization from "../../initialization";

const mockGetAuthV1MembershipsByOrgIdDomain = vi.fn();
const mockPostAuthV1MembershipsByOrgIdDomain = vi.fn();
const mockPostAuthV1MembershipsByOrgIdDomainVerification = vi.fn();
const mockPutAuthV1MembershipsByOrgIdDomainAutoJoin = vi.fn();
const mockDeleteAuthV1MembershipsByOrgIdDomain = vi.fn();

vi.mock("@rixl/sdk", () => ({
  getAuthV1MembershipsByOrgIdDomain: (...args: unknown[]) =>
    mockGetAuthV1MembershipsByOrgIdDomain(...args),
  postAuthV1MembershipsByOrgIdDomain: (...args: unknown[]) =>
    mockPostAuthV1MembershipsByOrgIdDomain(...args),
  postAuthV1MembershipsByOrgIdDomainVerification: (...args: unknown[]) =>
    mockPostAuthV1MembershipsByOrgIdDomainVerification(...args),
  putAuthV1MembershipsByOrgIdDomainAutoJoin: (...args: unknown[]) =>
    mockPutAuthV1MembershipsByOrgIdDomainAutoJoin(...args),
  deleteAuthV1MembershipsByOrgIdDomain: (...args: unknown[]) =>
    mockDeleteAuthV1MembershipsByOrgIdDomain(...args),
}));

import {
  getDomainStatus,
  initiateDomainVerification,
  checkDomainVerification,
  updateAutoJoin,
  removeDomain,
} from "@/domain";

describe("Domain Management Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    initialization.initDeferred.promise = Promise.resolve();
    mockGetAuthV1MembershipsByOrgIdDomain.mockReset();
    mockPostAuthV1MembershipsByOrgIdDomain.mockReset();
    mockPostAuthV1MembershipsByOrgIdDomainVerification.mockReset();
    mockPutAuthV1MembershipsByOrgIdDomainAutoJoin.mockReset();
    mockDeleteAuthV1MembershipsByOrgIdDomain.mockReset();
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
      mockGetAuthV1MembershipsByOrgIdDomain.mockResolvedValue({ data: mockResponse });

      const result = await getDomainStatus("org123");

      expect(mockGetAuthV1MembershipsByOrgIdDomain).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        throwOnError: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should return null when no domain is found (404)", async () => {
      mockGetAuthV1MembershipsByOrgIdDomain.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

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
      mockGetAuthV1MembershipsByOrgIdDomain.mockResolvedValue({ data: mockResponse });

      const result = await getDomainStatus("org123");

      expect(result).toEqual(mockResponse);
      expect(result?.verification_token).toBe("rixl-domain-verification=abc123");
    });

    it("should handle unauthorized error", async () => {
      mockGetAuthV1MembershipsByOrgIdDomain.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(getDomainStatus("org123")).rejects.toThrow();
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
      mockPostAuthV1MembershipsByOrgIdDomain.mockResolvedValue({ data: mockResponse });

      const result = await initiateDomainVerification("org123", "company.com");

      expect(mockPostAuthV1MembershipsByOrgIdDomain).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        body: { domain: "company.com" },
        throwOnError: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle validation error for invalid domain format", async () => {
      await expect(initiateDomainVerification("org123", "invalid")).rejects.toThrow(
        "Invalid domain format",
      );
    });

    it("should handle bad request error for public domain", async () => {
      mockPostAuthV1MembershipsByOrgIdDomain.mockRejectedValue({
        error: "bad_request",
        code: 400,
      });

      await expect(initiateDomainVerification("org123", "gmail.com")).rejects.toThrow();
    });

    it("should handle forbidden error for non-enterprise plan", async () => {
      mockPostAuthV1MembershipsByOrgIdDomain.mockRejectedValue({
        error: "forbidden",
        code: 403,
      });

      await expect(initiateDomainVerification("org123", "company.com")).rejects.toThrow();
    });

    it("should handle conflict error for already claimed domain", async () => {
      mockPostAuthV1MembershipsByOrgIdDomain.mockRejectedValue({
        error: "conflict",
        code: 409,
      });

      await expect(initiateDomainVerification("org123", "claimed.com")).rejects.toThrow();
    });

    it("should handle unauthorized error", async () => {
      mockPostAuthV1MembershipsByOrgIdDomain.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(initiateDomainVerification("org123", "company.com")).rejects.toThrow();
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
      mockPostAuthV1MembershipsByOrgIdDomainVerification.mockResolvedValue({
        data: mockResponse,
      });

      const result = await checkDomainVerification("org123");

      expect(mockPostAuthV1MembershipsByOrgIdDomainVerification).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        throwOnError: true,
      });
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
      mockPostAuthV1MembershipsByOrgIdDomainVerification.mockResolvedValue({
        data: mockResponse,
      });

      const result = await checkDomainVerification("org123");

      expect(result.status).toBe(DomainStatus.PENDING);
    });

    it("should handle bad request error for DNS lookup failure", async () => {
      mockPostAuthV1MembershipsByOrgIdDomainVerification.mockRejectedValue({
        error: "bad_request",
        code: 400,
      });

      await expect(checkDomainVerification("org123")).rejects.toThrow();
    });

    it("should handle not found error when no pending request exists", async () => {
      mockPostAuthV1MembershipsByOrgIdDomainVerification.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(checkDomainVerification("org123")).rejects.toThrow();
    });

    it("should handle unauthorized error", async () => {
      mockPostAuthV1MembershipsByOrgIdDomainVerification.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(checkDomainVerification("org123")).rejects.toThrow();
    });

    it("should handle forbidden error", async () => {
      mockPostAuthV1MembershipsByOrgIdDomainVerification.mockRejectedValue({
        error: "forbidden",
        code: 403,
      });

      await expect(checkDomainVerification("org123")).rejects.toThrow();
    });
  });

  describe("updateAutoJoin", () => {
    it("should enable auto-join successfully", async () => {
      const mockResponse = { enabled: true };
      mockPutAuthV1MembershipsByOrgIdDomainAutoJoin.mockResolvedValue({ data: mockResponse });

      const result = await updateAutoJoin("org123", true);

      expect(mockPutAuthV1MembershipsByOrgIdDomainAutoJoin).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        body: { enabled: true },
        throwOnError: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should disable auto-join successfully", async () => {
      const mockResponse = { enabled: false };
      mockPutAuthV1MembershipsByOrgIdDomainAutoJoin.mockResolvedValue({ data: mockResponse });

      const result = await updateAutoJoin("org123", false);

      expect(mockPutAuthV1MembershipsByOrgIdDomainAutoJoin).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        body: { enabled: false },
        throwOnError: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle forbidden error for non-enterprise plan", async () => {
      mockPutAuthV1MembershipsByOrgIdDomainAutoJoin.mockRejectedValue({
        error: "forbidden",
        code: 403,
      });

      await expect(updateAutoJoin("org123", true)).rejects.toThrow();
    });

    it("should handle not found error when no verified domain exists", async () => {
      mockPutAuthV1MembershipsByOrgIdDomainAutoJoin.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(updateAutoJoin("org123", true)).rejects.toThrow();
    });

    it("should handle unauthorized error", async () => {
      mockPutAuthV1MembershipsByOrgIdDomainAutoJoin.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(updateAutoJoin("org123", true)).rejects.toThrow();
    });
  });

  describe("removeDomain", () => {
    it("should remove domain successfully", async () => {
      mockDeleteAuthV1MembershipsByOrgIdDomain.mockResolvedValue({ data: {} });

      await removeDomain("org123");

      expect(mockDeleteAuthV1MembershipsByOrgIdDomain).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        throwOnError: true,
      });
    });

    it("should handle not found error when no verified domain exists", async () => {
      mockDeleteAuthV1MembershipsByOrgIdDomain.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(removeDomain("org123")).rejects.toThrow();
    });

    it("should handle unauthorized error", async () => {
      mockDeleteAuthV1MembershipsByOrgIdDomain.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(removeDomain("org123")).rejects.toThrow();
    });

    it("should work with different organization IDs", async () => {
      mockDeleteAuthV1MembershipsByOrgIdDomain.mockResolvedValue({ data: {} });

      await removeDomain("org456");

      expect(mockDeleteAuthV1MembershipsByOrgIdDomain).toHaveBeenCalledWith({
        path: { orgId: "org456" },
        throwOnError: true,
      });
    });
  });
});
