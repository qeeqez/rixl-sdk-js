import {authV1MembershipServiceUpdateOrgName, authV1MembershipServiceUpdateOrgUsername} from "../generated/sdk.gen";
import {apiCall} from "./api/utils";
import {HTTP_STATUS} from "./constants";
import {validateInput} from "./validation/base";
import {UpdateNameSchema, UpdateUsernameSchema} from "./validation/user";

export const updateOrgName = async (fullName: string, orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(UpdateNameSchema, {full_name: fullName});
      await authV1MembershipServiceUpdateOrgName({
        path: {"user.org_id": orgId},
        body: requestBody,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Only owners and admins can update name"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Name can only be changed once every 7 days."),
    }
  );
};

export const updateOrgUsername = async (username: string, orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(UpdateUsernameSchema, {username});
      await authV1MembershipServiceUpdateOrgUsername({
        path: {"user.org_id": orgId},
        body: requestBody,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Only owners and admins can update username"),
      [HTTP_STATUS.CONFLICT]: () => new Error("Username is not unique. Choose another one!"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Username can only be changed once every 30 days."),
    }
  );
};
