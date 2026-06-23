import {
  postAuthV1MembershipsByOrgIdMembersInvite,
  postAuthV1MembershipsByOrgIdMembersInviteResend,
  postAuthV1InvitationsByTokenAccept,
  postAuthV1InvitationsByTokenDecline,
} from "@rixl/sdk";
import { getToken } from "../authStore";
import { authenticatedFetch } from "../api/fetchers";
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

export const inviteMember = async (
  orgId: string,
  username: string,
  role: MembershipRole,
): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(InviteMemberSchema, { username, role });
      await postAuthV1MembershipsByOrgIdMembersInvite({
        path: { orgId },
        body: requestBody,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to invite members!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error(`User with username ${username} not found!`),
      [HTTP_STATUS.CONFLICT]: () => new Error(`User with username ${username} already exists!`),
    },
  );
};

export const resendMemberInvite = async (orgId: string, userId: string): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(ResendInviteSchema, { user_id: userId });
      await postAuthV1MembershipsByOrgIdMembersInviteResend({
        path: { orgId },
        body: requestBody,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to invite members!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error(`User with ID ${userId} not found!`),
      [HTTP_STATUS.CONFLICT]: () => new Error(`User with ID ${userId} already exists!`),
    },
  );
};

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
      validateInput(PublicInviteResponseSchema, { state });

      if (state === MembershipState.ACCEPT) {
        await postAuthV1InvitationsByTokenAccept({
          path: { token },
          throwOnError: true,
        });
      } else {
        await postAuthV1InvitationsByTokenDecline({
          path: { token },
          throwOnError: true,
        });
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid invitation token!"),
    },
  );
};
