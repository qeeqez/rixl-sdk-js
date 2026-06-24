import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { MembershipRole } from "@/membership";
import { setupAuthTest, cleanupAuthMocks } from "../utils/auth-test-helpers";

const mockPutAuthV1MembershipsByOrgIdActive = vi.fn();
const mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole = vi.fn();
const mockDeleteAuthV1MembershipsByOrgIdMembersByUserId = vi.fn();
const mockDeleteAuthV1MembershipsByOrgIdLeave = vi.fn();

vi.mock("../../generated/sdk.gen", () => ({
  putAuthV1MembershipsByOrgIdActive: (...args: unknown[]) =>
    mockPutAuthV1MembershipsByOrgIdActive(...args),
  putAuthV1MembershipsByOrgIdMembersByUserIdRole: (...args: unknown[]) =>
    mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole(...args),
  deleteAuthV1MembershipsByOrgIdMembersByUserId: (...args: unknown[]) =>
    mockDeleteAuthV1MembershipsByOrgIdMembersByUserId(...args),
  deleteAuthV1MembershipsByOrgIdLeave: (...args: unknown[]) =>
    mockDeleteAuthV1MembershipsByOrgIdLeave(...args),
}));

import {
  updateActiveMembership,
  updateMemberRole,
  deleteMember,
  leaveOrganization,
} from "@/membership";

describe("Membership Manage Module", () => {
  let mocks: ReturnType<typeof setupAuthTest>;

  beforeEach(() => {
    mocks = setupAuthTest();
    mockPutAuthV1MembershipsByOrgIdActive.mockReset();
    mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole.mockReset();
    mockDeleteAuthV1MembershipsByOrgIdMembersByUserId.mockReset();
    mockDeleteAuthV1MembershipsByOrgIdLeave.mockReset();
  });

  afterEach(() => {
    cleanupAuthMocks(mocks);
  });

  describe("updateActiveMembership", () => {
    it("should update active membership successfully", async () => {
      mockPutAuthV1MembershipsByOrgIdActive.mockResolvedValue({ data: {} });

      await updateActiveMembership("org123");

      expect(mockPutAuthV1MembershipsByOrgIdActive).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        throwOnError: true,
      });
    });

    it("should invalidate token after update", async () => {
      mockPutAuthV1MembershipsByOrgIdActive.mockResolvedValue({ data: {} });

      await updateActiveMembership("org456");

      expect(mockPutAuthV1MembershipsByOrgIdActive).toHaveBeenCalledWith({
        path: { orgId: "org456" },
        throwOnError: true,
      });
    });

    it("should handle unauthorized error", async () => {
      mockPutAuthV1MembershipsByOrgIdActive.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(updateActiveMembership("org123")).rejects.toThrow();
    });
  });

  describe("updateMemberRole", () => {
    it("should update member role successfully", async () => {
      mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole.mockResolvedValue({ data: {} });

      await updateMemberRole("org123", "user456", MembershipRole.ADMIN);

      expect(mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole).toHaveBeenCalledWith({
        path: { orgId: "org123", userId: "user456" },
        body: { role: MembershipRole.ADMIN },
        throwOnError: true,
      });
    });

    it("should update to different roles", async () => {
      mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole.mockResolvedValue({ data: {} });

      await updateMemberRole("org123", "user789", MembershipRole.MEMBER);

      expect(mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole).toHaveBeenCalledWith({
        path: { orgId: "org123", userId: "user789" },
        body: { role: MembershipRole.MEMBER },
        throwOnError: true,
      });
    });

    it("should handle unauthorized error", async () => {
      mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(updateMemberRole("org123", "user456", MembershipRole.ADMIN)).rejects.toThrow();
    });

    it("should handle member not found error", async () => {
      mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(updateMemberRole("org123", "user999", MembershipRole.ADMIN)).rejects.toThrow();
    });

    it("should handle forbidden error for owner", async () => {
      mockPutAuthV1MembershipsByOrgIdMembersByUserIdRole.mockRejectedValue({
        error: "forbidden",
        code: 403,
      });

      await expect(updateMemberRole("org123", "owner123", MembershipRole.MEMBER)).rejects.toThrow();
    });
  });

  describe("deleteMember", () => {
    it("should delete member successfully", async () => {
      mockDeleteAuthV1MembershipsByOrgIdMembersByUserId.mockResolvedValue({ data: {} });

      await deleteMember("org123", "user456");

      expect(mockDeleteAuthV1MembershipsByOrgIdMembersByUserId).toHaveBeenCalledWith({
        path: { orgId: "org123", userId: "user456" },
        throwOnError: true,
      });
    });

    it("should handle unauthorized error", async () => {
      mockDeleteAuthV1MembershipsByOrgIdMembersByUserId.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(deleteMember("org123", "user456")).rejects.toThrow();
    });

    it("should handle member not found error", async () => {
      mockDeleteAuthV1MembershipsByOrgIdMembersByUserId.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(deleteMember("org123", "user999")).rejects.toThrow();
    });

    it("should handle forbidden error for owner", async () => {
      mockDeleteAuthV1MembershipsByOrgIdMembersByUserId.mockRejectedValue({
        error: "forbidden",
        code: 403,
      });

      await expect(deleteMember("org123", "owner123")).rejects.toThrow();
    });
  });

  describe("leaveOrganization", () => {
    it("should leave organization successfully", async () => {
      mockDeleteAuthV1MembershipsByOrgIdLeave.mockResolvedValue({ data: {} });

      await leaveOrganization("org123");

      expect(mockDeleteAuthV1MembershipsByOrgIdLeave).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        throwOnError: true,
      });
    });

    it("should handle unauthorized error", async () => {
      mockDeleteAuthV1MembershipsByOrgIdLeave.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(leaveOrganization("org123")).rejects.toThrow();
    });

    it("should handle forbidden error for last member", async () => {
      mockDeleteAuthV1MembershipsByOrgIdLeave.mockRejectedValue({
        error: "forbidden",
        code: 403,
      });

      await expect(leaveOrganization("org123")).rejects.toThrow();
    });

    it("should handle organization not found error", async () => {
      mockDeleteAuthV1MembershipsByOrgIdLeave.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(leaveOrganization("org999")).rejects.toThrow();
    });
  });
});
