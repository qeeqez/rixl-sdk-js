import { getToken } from "../authStore";
import { authenticatedFetch } from "../api/fetchers";
import { ApiError } from "../api/types";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { validateInput } from "../validation/base";
import { AddDomainSchema, UpdateAutoJoinSchema } from "../validation/domain";
import { DomainResponse, AutoJoinSetting } from "./types";

export * from "./types";

/**
 * Gets the current domain status for an organization
 * Returns the domain with its verification status, token (if pending), or auto_join setting (if verified)
 *
 * @param orgId The organization ID
 * @returns Domain response with status details, or null if no domain is configured
 */
export const getDomainStatus = async (orgId: string): Promise<DomainResponse | null> => {
  return apiCall(
    async () => {
      try {
        return await authenticatedFetch<DomainResponse>(`memberships/${orgId}/domain`, getToken, {
          method: "GET",
        });
      } catch (error) {
        // Return null if no domain is found (404)
        if (error instanceof ApiError && error.status === HTTP_STATUS.NOT_FOUND) {
          return null;
        }
        throw error;
      }
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to view domain settings"),
    },
  );
};

/**
 * Initiates domain verification for an organization
 * Creates a verification request and returns the verification token to be added as a DNS TXT record
 *
 * @param orgId The organization ID
 * @param domain The domain to verify (e.g., "company.com")
 * @returns Domain response with pending status and verification token
 * @throws Error if domain is invalid, public domain, already claimed, or enterprise plan required
 */
export const initiateDomainVerification = async (
  orgId: string,
  domain: string,
): Promise<DomainResponse> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(AddDomainSchema, { domain });
      return await authenticatedFetch<DomainResponse>(`memberships/${orgId}/domain`, getToken, {
        method: "POST",
        body: requestBody,
      });
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () =>
        new Error("Invalid domain format or public domains like gmail.com are not allowed"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to configure domain settings"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Domain verification requires an Enterprise plan"),
      [HTTP_STATUS.CONFLICT]: () =>
        new Error("This domain is already claimed by another organization"),
    },
  );
};

/**
 * Checks domain verification by performing a DNS lookup
 * This triggers the backend to check if the DNS TXT record has been added
 *
 * @param orgId The organization ID
 * @returns Domain response with updated status (verified if DNS check passes, pending otherwise)
 * @throws Error if no pending verification request exists
 */
export const checkDomainVerification = async (orgId: string): Promise<DomainResponse> => {
  return apiCall(
    async () => {
      return await authenticatedFetch<DomainResponse>(
        `memberships/${orgId}/domain/verification`,
        getToken,
        {
          method: "POST",
        },
      );
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () =>
        new Error("DNS verification failed. Please check your DNS settings and try again"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to check domain verification"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("You do not have permission to verify this domain"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("No pending domain verification request found"),
    },
  );
};

/**
 * Updates the auto-join setting for a verified domain
 * When enabled, users with matching email domains will automatically join the organization
 *
 * @param orgId The organization ID
 * @param enabled Whether to enable or disable auto-join
 * @returns The updated auto-join setting
 * @throws Error if no verified domain exists or enterprise plan required
 */
export const updateAutoJoin = async (orgId: string, enabled: boolean): Promise<AutoJoinSetting> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(UpdateAutoJoinSchema, { enabled });
      return await authenticatedFetch<AutoJoinSetting>(
        `memberships/${orgId}/domain/auto-join`,
        getToken,
        {
          method: "PUT",
          body: requestBody,
        },
      );
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to update auto-join settings"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Auto-join settings require an Enterprise plan"),
      [HTTP_STATUS.NOT_FOUND]: () =>
        new Error("No verified domain found. Please verify your domain first"),
    },
  );
};

/**
 * Removes a verified domain from an organization
 * This will disable auto-join and allow the organization to verify a different domain
 *
 * @param orgId The organization ID
 * @throws Error if no verified domain exists
 */
export const removeDomain = async (orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      await authenticatedFetch<void>(`memberships/${orgId}/domain`, getToken, {
        method: "DELETE",
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to remove domain"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("No verified domain found to remove"),
    },
  );
};
