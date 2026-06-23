import { getToken } from "../authStore";
import { authenticatedFetch, publicFetch } from "../api/fetchers";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { MembershipRole, MembershipState } from "./types";
import { validateInput } from "../validation/base";
import {
  AcceptDeclineMembershipSchema,
  PublicInviteResponseSchema,
  InviteMemberSchema,
  ResendInviteSchema,
} from "../validation/membership";

/**
 * Invites a user to join an organization
 * @param orgId The ID of the organization
 * @param username The username of the user to invite
 * @param role The role to assign to the invited user
 * @returns A promise that resolves when the invitation is sent
 */
export const inviteMember = async (
  orgId: string,
  username: string,
  role: MembershipRole,
): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(InviteMemberSchema, { username, role });
      await authenticatedFetch<void>(`memberships/${orgId}/members/invite`, getToken, {
        method: "POST",
        body: requestBody,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to invite members!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error(`User with username ${username} not found!`),
      [HTTP_STATUS.CONFLICT]: () => new Error(`User with username ${username} already exists!`),
    },
  );
};

/**
 * Resends Invites to a user to join an organization
 * @param orgId The ID of the organization
 * @param userId The ID of the user to invite
 * @returns A promise that resolves when the invitation is sent
 */
export const resendMemberInvite = async (orgId: string, userId: string): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(ResendInviteSchema, { user_id: userId });
      await authenticatedFetch<void>(`memberships/${orgId}/members/invite/resend`, getToken, {
        method: "POST",
        body: requestBody,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to invite members!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error(`User with ID ${userId} not found!`),
      [HTTP_STATUS.CONFLICT]: () => new Error(`User with ID ${userId} already exists!`),
    },
  );
};

/**
 * Accept or decline an invitation to join an organization
 * @param orgId The ID of the organization
 * @param state The new state of the membership (accepted or declined)
 * @returns A promise that resolves when the invitation is accepted or declined
 */
export const respondToInvitation = async (
  orgId: string,
  state: MembershipState.ACCEPTED | MembershipState.DECLINED,
): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(AcceptDeclineMembershipSchema, { state });

      await authenticatedFetch<void>(`memberships/${orgId}/membership/state`, getToken, {
        method: "PUT",
        body: requestBody,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () =>
        new Error("User is not authorized to accept/decline an Invite!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Invite not found!"),
    },
  );
};

export const publicRespondToInvitation = async (
  token: string,
  state: MembershipState.ACCEPT | MembershipState.DECLINE,
): Promise<void> => {
  return apiCall(
    async () => {
      // Validate state parameter using valibot
      validateInput(PublicInviteResponseSchema, { state });

      await publicFetch<void>(`invitations/${token}/${state}`, { method: "POST" });
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid invitation token!"),
    },
  );
};
