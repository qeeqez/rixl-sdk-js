import {
  authV1MembershipServiceListMemberships,
  authV1MembershipServiceListMembershipApplications,
  authV1MembershipServiceListOrganizationMembers,
} from "../../generated/sdk.gen";
import {apiCall} from "../api/utils";
import {HTTP_STATUS} from "../constants";
import {toMembership, toMembershipApplication, toMember} from "./mappers";
import type {PaginationParams} from "../pagination-utils";
import type {Membership, MembershipApplication, Member} from "./types";

export const listActiveMemberships = async (paginationParams?: PaginationParams): Promise<Membership[]> => {
  return apiCall(
    async () => {
      const {data} = await authV1MembershipServiceListMemberships({
        query: {state: "MEMBERSHIP_STATE_ACTIVE", limit: 25, ...paginationParams},
        throwOnError: true,
      });

      return (data.memberships || []).map(toMembership);
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to list memberships!"),
    }
  );
};

export const listPendingMemberships = async (paginationParams?: PaginationParams): Promise<MembershipApplication[]> => {
  return apiCall(
    async () => {
      const {data} = await authV1MembershipServiceListMembershipApplications({
        query: {state: "MEMBERSHIP_APPLICATION_STATE_PENDING", limit: 25, ...paginationParams},
        throwOnError: true,
      });

      return (data.applications || []).map(toMembershipApplication);
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to list membership applications!"),
    }
  );
};

export const listOrganizationMembers = async (orgId: string, paginationParams?: PaginationParams): Promise<Member[]> => {
  return apiCall(
    async () => {
      const {data} = await authV1MembershipServiceListOrganizationMembers({
        path: {"user.org_id": orgId},
        query: paginationParams,
        throwOnError: true,
      });

      return (data.members || []).map(toMember);
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to list organization members!"),
    }
  );
};
