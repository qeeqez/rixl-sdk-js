/**
 * Membership Invite Module Tests
 * Tests: inviteMember, resendMemberInvite, respondToInvitation, publicRespondToInvitation
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { MembershipRole, MembershipState } from "@/membership";

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
import { authenticatedFetch, publicFetch } from "../../api/fetchers";
import {
  inviteMember,
  resendMemberInvite,
  respondToInvitation,
  publicRespondToInvitation,
} from "@/membership";

describe("Membership Invite Module", () => {
  const mockAuthenticatedFetch = authenticatedFetch as any;
  const mockPublicFetch = publicFetch as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("inviteMember", () => {
    it("should invite a member successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await inviteMember("org123", "newuser", MembershipRole.MEMBER);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/members/invite",
        expect.any(Function),
        expect.objectContaining({
          method: "POST",
          body: { username: "newuser", role: MembershipRole.MEMBER },
        }),
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", {
          status: 401,
          endpoint: "memberships/org123/members/invite",
        }),
      );

      await expect(inviteMember("org123", "newuser", MembershipRole.MEMBER)).rejects.toThrow(
        "User is not authorized to invite members!",
      );
    });

    it("should handle user not found error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", { status: 404, endpoint: "memberships/org123/members/invite" }),
      );

      await expect(inviteMember("org123", "nonexistent", MembershipRole.MEMBER)).rejects.toThrow(
        "User with username nonexistent not found!",
      );
    });

    it("should handle user already exists error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Conflict", { status: 409, endpoint: "memberships/org123/members/invite" }),
      );

      await expect(inviteMember("org123", "existinguser", MembershipRole.MEMBER)).rejects.toThrow(
        "User with username existinguser already exists!",
      );
    });

    it("should work with different roles", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await inviteMember("org123", "admin", MembershipRole.ADMIN);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/members/invite",
        expect.any(Function),
        expect.objectContaining({
          body: { username: "admin", role: MembershipRole.ADMIN },
        }),
      );
    });
  });

  describe("resendMemberInvite", () => {
    it("should resend invite successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await resendMemberInvite("org123", "user456");

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/members/invite/resend",
        expect.any(Function),
        expect.objectContaining({
          method: "POST",
          body: { user_id: "user456" },
        }),
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", {
          status: 401,
          endpoint: "memberships/org123/members/invite/resend",
        }),
      );

      await expect(resendMemberInvite("org123", "user456")).rejects.toThrow(
        "User is not authorized to invite members!",
      );
    });

    it("should handle user not found error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", {
          status: 404,
          endpoint: "memberships/org123/members/invite/resend",
        }),
      );

      await expect(resendMemberInvite("org123", "user456")).rejects.toThrow(
        "User with ID user456 not found!",
      );
    });

    it("should handle conflict error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Conflict", {
          status: 409,
          endpoint: "memberships/org123/members/invite/resend",
        }),
      );

      await expect(resendMemberInvite("org123", "user456")).rejects.toThrow(
        "User with ID user456 already exists!",
      );
    });
  });

  describe("respondToInvitation", () => {
    it("should accept invitation successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await respondToInvitation("org123", MembershipState.ACCEPTED);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/membership/state",
        expect.any(Function),
        expect.objectContaining({
          method: "PUT",
          body: { state: MembershipState.ACCEPTED },
        }),
      );
    });

    it("should decline invitation successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await respondToInvitation("org123", MembershipState.DECLINED);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "memberships/org123/membership/state",
        expect.any(Function),
        expect.objectContaining({
          method: "PUT",
          body: { state: MembershipState.DECLINED },
        }),
      );
    });

    it("should handle unauthorized error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Unauthorized", {
          status: 401,
          endpoint: "memberships/org123/membership/state",
        }),
      );

      await expect(respondToInvitation("org123", MembershipState.ACCEPTED)).rejects.toThrow(
        "User is not authorized to accept/decline an Invite!",
      );
    });

    it("should handle invite not found error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Not Found", { status: 404, endpoint: "memberships/org123/membership/state" }),
      );

      await expect(respondToInvitation("org123", MembershipState.ACCEPTED)).rejects.toThrow(
        "Invite not found!",
      );
    });
  });

  describe("publicRespondToInvitation", () => {
    it("should accept public invitation successfully", async () => {
      mockPublicFetch.mockResolvedValue(undefined);

      await publicRespondToInvitation("invite-token-123", MembershipState.ACCEPT);

      expect(mockPublicFetch).toHaveBeenCalledWith(
        `invitations/invite-token-123/${MembershipState.ACCEPT}`,
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    it("should decline public invitation successfully", async () => {
      mockPublicFetch.mockResolvedValue(undefined);

      await publicRespondToInvitation("invite-token-456", MembershipState.DECLINE);

      expect(mockPublicFetch).toHaveBeenCalledWith(
        `invitations/invite-token-456/${MembershipState.DECLINE}`,
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    it("should handle invalid token error", async () => {
      const { ApiError } = await import("../../api/error-handlers");
      mockPublicFetch.mockRejectedValue(
        new ApiError("Bad Request", { status: 400, endpoint: "/invitations/invalid-token/accept" }),
      );

      await expect(
        publicRespondToInvitation("invalid-token", MembershipState.ACCEPT),
      ).rejects.toThrow("Invalid invitation token!");
    });

    it("should work with different tokens", async () => {
      mockPublicFetch.mockResolvedValue(undefined);

      const token = "another-token-789";
      await publicRespondToInvitation(token, MembershipState.ACCEPT);

      expect(mockPublicFetch).toHaveBeenCalledWith(
        `invitations/${token}/${MembershipState.ACCEPT}`,
        expect.any(Object),
      );
    });
  });
});
