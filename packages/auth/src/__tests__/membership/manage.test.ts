/**
 * Membership Manage Module Tests
 * Tests: updateActiveMembership, updateMemberRole, deleteMember, leaveOrganization
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { MembershipRole } from "@/membership";

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
  accessToken: { set: vi.fn() },
  expireAt: { set: vi.fn() },
}));

// Mock api/utils to prevent initDeferred issues
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
import * as authStore from "../../authStore";
import {
  updateActiveMembership,
  updateMemberRole,
  deleteMember,
  leaveOrganization,
} from "@/membership";

describe("Membership Manage Module", () => {
  const mockAuthenticatedFetch = authenticatedFetch as any;
  const mockGetToken = authStore.getToken as any;
  const mockAccessToken = authStore.accessToken as any;
  const mockExpireAt = authStore.expireAt as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateActiveMembership", () => {
    it("should update active membership successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);
      mockGetToken.mockResolvedValue("new-token");

      await updateActiveMembership("org123");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/active",
        expect.any(Function),
        expect.objectContaining({
          method: "PUT",
        }),
      );
      expect(mockAccessToken.set).toHaveBeenCalledWith(undefined);
      expect(mockExpireAt.set).toHaveBeenCalledWith(0);
      expect(mockGetToken).toHaveBeenCalled();
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", { status: 401, endpoint: "memberships/org123/active" }),
      );

      await expect(updateActiveMembership("org123")).rejects.toThrow(
        "User is not authorized to update active membership!",
      );
    });

    it("should invalidate token after update", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);
      mockGetToken.mockResolvedValue("refreshed-token");

      await updateActiveMembership("org456");

      expect(mockAccessToken.set).toHaveBeenCalledWith(undefined);
      expect(mockExpireAt.set).toHaveBeenCalledWith(0);
      expect(mockGetToken).toHaveBeenCalledTimes(1);
    });

    it("should work with different organization IDs", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);
      mockGetToken.mockResolvedValue("token");

      await updateActiveMembership("org789");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org789/active",
        expect.any(Function),
        expect.any(Object),
      );
    });
  });

  describe("updateMemberRole", () => {
    it("should update member role successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await updateMemberRole("org123", "user456", MembershipRole.ADMIN);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/members/user456/role",
        expect.any(Function),
        expect.objectContaining({
          method: "PUT",
          body: { role: MembershipRole.ADMIN },
        }),
      );
    });

    it("should update to different roles", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await updateMemberRole("org123", "user789", MembershipRole.MEMBER);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/members/user789/role",
        expect.any(Function),
        expect.objectContaining({
          body: { role: MembershipRole.MEMBER },
        }),
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", {
          status: 401,
          endpoint: "memberships/org123/members/user456/role",
        }),
      );

      await expect(updateMemberRole("org123", "user456", MembershipRole.ADMIN)).rejects.toThrow(
        "User is not authorized to update member roles!",
      );
    });

    it("should handle member not found error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", {
          status: 404,
          endpoint: "memberships/org123/members/user999/role",
        }),
      );

      await expect(updateMemberRole("org123", "user999", MembershipRole.ADMIN)).rejects.toThrow(
        "Member not found!",
      );
    });

    it("should handle forbidden error for owner", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Forbidden", {
          status: 403,
          endpoint: "memberships/org123/members/owner123/role",
        }),
      );

      await expect(updateMemberRole("org123", "owner123", MembershipRole.MEMBER)).rejects.toThrow(
        "Cannot change role of organization owner!",
      );
    });
  });

  describe("deleteMember", () => {
    it("should delete member successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await deleteMember("org123", "user456");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/members/user456",
        expect.any(Function),
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", {
          status: 401,
          endpoint: "memberships/org123/members/user456",
        }),
      );

      await expect(deleteMember("org123", "user456")).rejects.toThrow(
        "User is not authorized to delete members!",
      );
    });

    it("should handle member not found error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", { status: 404, endpoint: "memberships/org123/members/user999" }),
      );

      await expect(deleteMember("org123", "user999")).rejects.toThrow("Member not found!");
    });

    it("should handle forbidden error for owner", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Forbidden", { status: 403, endpoint: "memberships/org123/members/owner123" }),
      );

      await expect(deleteMember("org123", "owner123")).rejects.toThrow(
        "Cannot remove organization owner!",
      );
    });

    it("should work with different user IDs", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await deleteMember("org789", "user999");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org789/members/user999",
        expect.any(Function),
        expect.any(Object),
      );
    });
  });

  describe("leaveOrganization", () => {
    it("should leave organization successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await leaveOrganization("org123");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/leave",
        expect.any(Function),
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", { status: 401, endpoint: "memberships/org123/leave" }),
      );

      await expect(leaveOrganization("org123")).rejects.toThrow(
        "User is not authorized to leave an organization!",
      );
    });

    it("should handle forbidden error for last member", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Forbidden", { status: 403, endpoint: "memberships/org123/leave" }),
      );

      await expect(leaveOrganization("org123")).rejects.toThrow(
        "Cannot leave organization as you are the last member!",
      );
    });

    it("should handle organization not found error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", { status: 404, endpoint: "memberships/org999/leave" }),
      );

      await expect(leaveOrganization("org999")).rejects.toThrow("Organization not found!");
    });

    it("should work with different organization IDs", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await leaveOrganization("org456");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org456/leave",
        expect.any(Function),
        expect.any(Object),
      );
    });
  });
});
