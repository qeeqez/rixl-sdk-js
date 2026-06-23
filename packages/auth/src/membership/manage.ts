import { accessToken, expireAt, getToken } from "../authStore";
import { authenticatedFetch } from "../api/fetchers";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { MembershipRole } from "./types";
import { validateInput } from "../validation/base";
import { UpdateMemberRoleSchema } from "../validation/membership";

/**
 * Updates the active organization for the current user
 * @param orgId The ID of the organization to set as active
 * @returns A promise that resolves when the active organization is updated
 */
export const updateActiveMembership = async (orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      await authenticatedFetch<void>(`memberships/${orgId}/active`, getToken, { method: "PUT" });
      // Invalidate token to force refresh with new org context
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

/**
 * Updates the role of a member in an organization
 * @param orgId The ID of the organization
 * @param userId The ID of the user whose role is being updated
 * @param role The new role to assign to the user
 * @returns A promise that resolves when the role is updated
 */
export const updateMemberRole = async (
  orgId: string,
  userId: string,
  role: MembershipRole,
): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(UpdateMemberRoleSchema, { role });
      await authenticatedFetch<void>(`memberships/${orgId}/members/${userId}/role`, getToken, {
        method: "PUT",
        body: requestBody,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to update member roles!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Member not found!"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Cannot change role of organization owner!"),
    },
  );
};

/**
 * Removes a member from an organization
 * @param orgId The ID of the organization
 * @param userId The ID of the user to remove
 * @returns A promise that resolves when the member is removed
 */
export const deleteMember = async (orgId: string, userId: string): Promise<void> => {
  return apiCall(
    async () => {
      await authenticatedFetch<void>(`memberships/${orgId}/members/${userId}`, getToken, {
        method: "DELETE",
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to delete members!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Member not found!"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Cannot remove organization owner!"),
    },
  );
};

/**
 * Leaves an organization
 * @param orgId The ID of the organization
 * @returns A promise that resolves when the user leaves the organization
 * @throws Error if the user is the last member of the organization
 */
export const leaveOrganization = async (orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      await authenticatedFetch<void>(`memberships/${orgId}/leave`, getToken, { method: "DELETE" });
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
