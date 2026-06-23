import {
  getAuthV1MembershipsActive,
  getAuthV1MembershipsPending,
  getAuthV1MembershipsByOrgIdMembers,
} from "@rixl/sdk";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { PaginationParams } from "../pagination-utils";
import { Membership, Member } from "./types";

export const listActiveMemberships = async (
  paginationParams?: PaginationParams,
): Promise<Membership[]> => {
  return apiCall(
    async () => {
      const { data } = await getAuthV1MembershipsActive({
        query: paginationParams,
        throwOnError: true,
      });

      return (data.memberships || []) as unknown as Membership[];
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to list memberships!"),
    },
  );
};

export const listPendingMemberships = async (
  paginationParams?: PaginationParams,
): Promise<Membership[]> => {
  return apiCall(
    async () => {
      const { data } = await getAuthV1MembershipsPending({
        query: paginationParams,
        throwOnError: true,
      });

      return (data.memberships || []) as unknown as Membership[];
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to list memberships!"),
    },
  );
};

export const listOrganizationMembers = async (
  orgId: string,
  paginationParams?: PaginationParams,
): Promise<Member[]> => {
  return apiCall(
    async () => {
      const { data } = await getAuthV1MembershipsByOrgIdMembers({
        path: { orgId },
        query: paginationParams,
        throwOnError: true,
      });

      return (data.members || []) as unknown as Member[];
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () =>
        new Error("User is not authorized to list organization members!"),
    },
  );
};
