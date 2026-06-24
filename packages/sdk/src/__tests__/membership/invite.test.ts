import {describe, it, expect, beforeEach, vi} from "vitest";
import {MembershipRole, MembershipState} from "@/membership";
import * as initialization from "../../auth/initialization";

const mockPostAuthV1MembershipsByOrgIdMembersInvite = vi.fn();
const mockPostAuthV1MembershipsByOrgIdMembersInviteResend = vi.fn();
const mockPostAuthV1InvitationsByTokenAccept = vi.fn();
const mockPostAuthV1InvitationsByTokenDecline = vi.fn();

vi.mock("../../generated/sdk.gen", () => ({
  postAuthV1MembershipsByOrgIdMembersInvite: (...args: unknown[]) => mockPostAuthV1MembershipsByOrgIdMembersInvite(...args),
  postAuthV1MembershipsByOrgIdMembersInviteResend: (...args: unknown[]) => mockPostAuthV1MembershipsByOrgIdMembersInviteResend(...args),
  postAuthV1InvitationsByTokenAccept: (...args: unknown[]) => mockPostAuthV1InvitationsByTokenAccept(...args),
  postAuthV1InvitationsByTokenDecline: (...args: unknown[]) => mockPostAuthV1InvitationsByTokenDecline(...args),
}));

vi.mock("../../auth/api/fetchers", () => ({
  authenticatedFetch: vi.fn(),
}));

vi.mock("../../auth/authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-token"),
}));

import {authenticatedFetch} from "../../auth/api/fetchers";
import {inviteMember, resendMemberInvite, respondToInvitation, publicRespondToInvitation} from "@/membership";

describe("Membership Invite Module", () => {
  const mockAuthenticatedFetch = authenticatedFetch as any;

  beforeEach(() => {
    vi.clearAllMocks();
    initialization.initDeferred.promise = Promise.resolve();
    mockPostAuthV1MembershipsByOrgIdMembersInvite.mockReset();
    mockPostAuthV1MembershipsByOrgIdMembersInviteResend.mockReset();
    mockPostAuthV1InvitationsByTokenAccept.mockReset();
    mockPostAuthV1InvitationsByTokenDecline.mockReset();
    mockAuthenticatedFetch.mockReset();
  });

  describe("inviteMember", () => {
    it("should invite a member successfully", async () => {
      mockPostAuthV1MembershipsByOrgIdMembersInvite.mockResolvedValue({data: {}});

      await inviteMember("org123", "newuser", MembershipRole.MEMBER);

      expect(mockPostAuthV1MembershipsByOrgIdMembersInvite).toHaveBeenCalledWith({
        path: {orgId: "org123"},
        body: {username: "newuser", role: MembershipRole.MEMBER},
        throwOnError: true,
      });
    });

    it("should handle unauthorized error", async () => {
      mockPostAuthV1MembershipsByOrgIdMembersInvite.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(inviteMember("org123", "newuser", MembershipRole.MEMBER)).rejects.toThrow();
    });

    it("should handle user not found error", async () => {
      mockPostAuthV1MembershipsByOrgIdMembersInvite.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(inviteMember("org123", "nonexistent", MembershipRole.MEMBER)).rejects.toThrow();
    });

    it("should handle user already exists error", async () => {
      mockPostAuthV1MembershipsByOrgIdMembersInvite.mockRejectedValue({
        error: "conflict",
        code: 409,
      });

      await expect(inviteMember("org123", "existinguser", MembershipRole.MEMBER)).rejects.toThrow();
    });

    it("should work with different roles", async () => {
      mockPostAuthV1MembershipsByOrgIdMembersInvite.mockResolvedValue({data: {}});

      await inviteMember("org123", "admin", MembershipRole.ADMIN);

      expect(mockPostAuthV1MembershipsByOrgIdMembersInvite).toHaveBeenCalledWith({
        path: {orgId: "org123"},
        body: {username: "admin", role: MembershipRole.ADMIN},
        throwOnError: true,
      });
    });
  });

  describe("resendMemberInvite", () => {
    it("should resend invite successfully", async () => {
      mockPostAuthV1MembershipsByOrgIdMembersInviteResend.mockResolvedValue({data: {}});

      await resendMemberInvite("org123", "user456");

      expect(mockPostAuthV1MembershipsByOrgIdMembersInviteResend).toHaveBeenCalledWith({
        path: {orgId: "org123"},
        body: {user_id: "user456"},
        throwOnError: true,
      });
    });

    it("should handle unauthorized error", async () => {
      mockPostAuthV1MembershipsByOrgIdMembersInviteResend.mockRejectedValue({
        error: "unauthorized",
        code: 401,
      });

      await expect(resendMemberInvite("org123", "user456")).rejects.toThrow();
    });

    it("should handle user not found error", async () => {
      mockPostAuthV1MembershipsByOrgIdMembersInviteResend.mockRejectedValue({
        error: "not_found",
        code: 404,
      });

      await expect(resendMemberInvite("org123", "user456")).rejects.toThrow();
    });

    it("should handle conflict error", async () => {
      mockPostAuthV1MembershipsByOrgIdMembersInviteResend.mockRejectedValue({
        error: "conflict",
        code: 409,
      });

      await expect(resendMemberInvite("org123", "user456")).rejects.toThrow();
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
          body: {state: MembershipState.ACCEPTED},
        })
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
          body: {state: MembershipState.DECLINED},
        })
      );
    });

    it("should handle unauthorized error", async () => {
      mockAuthenticatedFetch.mockRejectedValue(new Error("Unauthorized"));

      await expect(respondToInvitation("org123", MembershipState.ACCEPTED)).rejects.toThrow();
    });

    it("should handle invite not found error", async () => {
      mockAuthenticatedFetch.mockRejectedValue(new Error("Not Found"));

      await expect(respondToInvitation("org123", MembershipState.ACCEPTED)).rejects.toThrow();
    });
  });

  describe("publicRespondToInvitation", () => {
    it("should accept public invitation successfully", async () => {
      mockPostAuthV1InvitationsByTokenAccept.mockResolvedValue({data: {}});

      await publicRespondToInvitation("invite-token-123", MembershipState.ACCEPT);

      expect(mockPostAuthV1InvitationsByTokenAccept).toHaveBeenCalledWith({
        path: {token: "invite-token-123"},
        throwOnError: true,
      });
    });

    it("should decline public invitation successfully", async () => {
      mockPostAuthV1InvitationsByTokenDecline.mockResolvedValue({data: {}});

      await publicRespondToInvitation("invite-token-456", MembershipState.DECLINE);

      expect(mockPostAuthV1InvitationsByTokenDecline).toHaveBeenCalledWith({
        path: {token: "invite-token-456"},
        throwOnError: true,
      });
    });

    it("should handle invalid token error", async () => {
      mockPostAuthV1InvitationsByTokenAccept.mockRejectedValue({
        error: "bad_request",
        code: 400,
      });

      await expect(publicRespondToInvitation("invalid-token", MembershipState.ACCEPT)).rejects.toThrow();
    });

    it("should work with different tokens", async () => {
      mockPostAuthV1InvitationsByTokenAccept.mockResolvedValue({data: {}});

      await publicRespondToInvitation("another-token-789", MembershipState.ACCEPT);

      expect(mockPostAuthV1InvitationsByTokenAccept).toHaveBeenCalledWith({
        path: {token: "another-token-789"},
        throwOnError: true,
      });
    });
  });
});
