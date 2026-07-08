import {
  getAuthV1MembershipsByOrgIdDomain,
  postAuthV1MembershipsByOrgIdDomain,
  postAuthV1MembershipsByOrgIdDomainVerification,
  putAuthV1MembershipsByOrgIdDomainAutoJoin,
  deleteAuthV1MembershipsByOrgIdDomain,
} from "../../generated/sdk.gen";
import {apiCall} from "../api/utils";
import {HTTP_STATUS} from "../constants";
import {validateInput} from "../validation/base";
import {AddDomainSchema, UpdateAutoJoinSchema} from "../validation/domain";
import type {DomainResponse, AutoJoinSetting} from "./types";

export * from "./types";

export const getDomainStatus = async (orgId: string): Promise<DomainResponse | null> => {
  return apiCall(
    async () => {
      try {
        const {data} = await getAuthV1MembershipsByOrgIdDomain({
          path: {orgId},
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
    }
  );
};

export const initiateDomainVerification = async (orgId: string, domain: string): Promise<DomainResponse> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(AddDomainSchema, {domain});
      const {data} = await postAuthV1MembershipsByOrgIdDomain({
        path: {orgId},
        body: requestBody,
        throwOnError: true,
      });
      return data as unknown as DomainResponse;
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid domain format or public domains like gmail.com are not allowed"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to configure domain settings"),
    }
  );
};

export const checkDomainVerification = async (orgId: string): Promise<DomainResponse> => {
  return apiCall(
    async () => {
      const {data} = await postAuthV1MembershipsByOrgIdDomainVerification({
        path: {orgId},
        throwOnError: true,
      });
      return data as unknown as DomainResponse;
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to check domain verification"),
    }
  );
};

export const updateAutoJoin = async (orgId: string, enabled: boolean): Promise<AutoJoinSetting> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(UpdateAutoJoinSchema, {enabled});
      const {data} = await putAuthV1MembershipsByOrgIdDomainAutoJoin({
        path: {orgId},
        body: requestBody,
        throwOnError: true,
      });
      return data as unknown as AutoJoinSetting;
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to update auto-join settings"),
    }
  );
};

export const removeDomain = async (orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      await deleteAuthV1MembershipsByOrgIdDomain({
        path: {orgId},
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Not authorized to remove domain"),
    }
  );
};
