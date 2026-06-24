import {
  putAuthV1MembershipsByOrgIdActive,
  putAuthV1MembershipsByOrgIdMembersByUserIdRole,
  deleteAuthV1MembershipsByOrgIdMembersByUserId,
  deleteAuthV1MembershipsByOrgIdLeave,
} from "@rixl/sdk";
import { accessToken, expireAt, getToken } from "../authStore";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { AssignableRole } from "./types";
import { validateInput } from "../validation/base";
import { UpdateMemberRoleSchema } from "../validation/membership";

export const updateActiveMembership = async (orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      await putAuthV1MembershipsByOrgIdActive({
        path: { orgId },
        throwOnError: true,
      });
      accessToken.set(undefined);
      expireAt.set(0);
      await getToken();
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () =>
        new Error("User is not authorized to update active membership!"),
    },
  );
};

export const updateMemberRole = async (
  orgId: string,
  userId: string,
  role: AssignableRole,
): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(UpdateMemberRoleSchema, { role });
      await putAuthV1MembershipsByOrgIdMembersByUserIdRole({
        path: { orgId, userId },
        body: requestBody,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to update member roles!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Member not found!"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Cannot change role of organization owner!"),
    },
  );
};

export const deleteMember = async (orgId: string, userId: string): Promise<void> => {
  return apiCall(
    async () => {
      await deleteAuthV1MembershipsByOrgIdMembersByUserId({
        path: { orgId, userId },
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to delete members!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Member not found!"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Cannot remove organization owner!"),
    },
  );
};

export const leaveOrganization = async (orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      await deleteAuthV1MembershipsByOrgIdLeave({
        path: { orgId },
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () =>
        new Error("User is not authorized to leave an organization!"),
      [HTTP_STATUS.FORBIDDEN]: () =>
        new Error("Cannot leave organization as you are the last member!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Organization not found!"),
    },
  );
};
