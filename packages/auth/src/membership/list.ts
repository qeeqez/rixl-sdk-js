import { getToken } from "../authStore";
import { PaginationParams, fetchPaginatedData } from "../pagination-utils";
import { Membership, Member } from "./types";

// Fetch all active memberships
export const listActiveMemberships = async (
  paginationParams?: PaginationParams,
): Promise<Membership[]> => {
  return fetchPaginatedData<Membership[]>(
    "memberships/active",
    getToken,
    paginationParams,
    "User is not authorized to list memberships!",
  );
};

// Fetches all pending memberships
export const listPendingMemberships = async (
  paginationParams?: PaginationParams,
): Promise<Membership[]> => {
  return fetchPaginatedData<Membership[]>(
    "memberships/pending",
    getToken,
    paginationParams,
    "User is not authorized to list memberships!",
  );
};

/**
 * Lists all members of an organization
 * @param orgId The ID of the organization
 * @param paginationParams Limit and offset parameters for pagination.
 * @returns A promise that resolves to an array of members with user details
 */
export const listOrganizationMembers = async (
  orgId: string,
  paginationParams?: PaginationParams,
): Promise<Member[]> => {
  return fetchPaginatedData<Member[]>(
    `memberships/${orgId}/members`,
    getToken,
    paginationParams,
    "User is not authorized to list organization members!",
  );
};
