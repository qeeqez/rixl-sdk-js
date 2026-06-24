import {
  getAuthV1MembershipsByOrgIdDomain,
  postAuthV1MembershipsByOrgIdDomain,
  postAuthV1MembershipsByOrgIdDomainVerification,
  putAuthV1MembershipsByOrgIdDomainAutoJoin,
  deleteAuthV1MembershipsByOrgIdDomain,
} from "../../generated/sdk.gen";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { validateInput } from "../validation/base";
import { AddDomainSchema, UpdateAutoJoinSchema } from "../validation/domain";
import type { DomainResponse, AutoJoinSetting } from "./types";

export * from "./types";

export const getDomainStatus = async (orgId: string): Promise<DomainResponse | null> => {
  return apiCall(
    async () => {
      try {
        const { data } = await getAuthV1MembershipsByOrgIdDomain({
          path: { orgId },
          throwOnError: true,
        });
        return data as unknown as DomainResponse;
      } catch (error: any) {
        if (error?.code === HTTP_STATUS.NOT_FOUND) {
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

export const initiateDomainVerification = async (
  orgId: string,
  domain: string,
): Promise<DomainResponse> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(AddDomainSchema, { domain });
      const { data } = await postAuthV1MembershipsByOrgIdDomain({
        path: { orgId },
        body: requestBody,
        throwOnError: true,
      });
      return data as unknown as DomainResponse;
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

export const checkDomainVerification = async (orgId: string): Promise<DomainResponse> => {
  return apiCall(
    async () => {
      const { data } = await postAuthV1MembershipsByOrgIdDomainVerification({
        path: { orgId },
        throwOnError: true,
      });
      return data as unknown as DomainResponse;
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

export const updateAutoJoin = async (orgId: string, enabled: boolean): Promise<AutoJoinSetting> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(UpdateAutoJoinSchema, { enabled });
      const { data } = await putAuthV1MembershipsByOrgIdDomainAutoJoin({
        path: { orgId },
        body: requestBody,
        throwOnError: true,
      });
      return data as unknown as AutoJoinSetting;
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to update auto-join settings"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Auto-join settings require an Enterprise plan"),
      [HTTP_STATUS.NOT_FOUND]: () =>
        new Error("No verified domain found. Please verify your domain first"),
    },
  );
};

export const removeDomain = async (orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      await deleteAuthV1MembershipsByOrgIdDomain({
        path: { orgId },
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to remove domain"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("No verified domain found to remove"),
    },
  );
};
