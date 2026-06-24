import { putAuthV1MembershipsByOrgIdName, putAuthV1MembershipsByOrgIdUsername } from "@rixl/sdk";
import { apiCall } from "./api/utils";
import { HTTP_STATUS } from "./constants";
import { validateInput } from "./validation/base";
import { UpdateNameSchema, UpdateUsernameSchema } from "./validation/user";

export const updateOrgName = async (fullName: string, orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(UpdateNameSchema, { full_name: fullName });
      await putAuthV1MembershipsByOrgIdName({
        path: { orgId },
        body: requestBody,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () =>
        new Error("Name can only be changed once every 7 days."),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to update name"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Only owners and admins can update name"),
    },
  );
};

export const updateOrgUsername = async (username: string, orgId: string): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(UpdateUsernameSchema, { username });
      await putAuthV1MembershipsByOrgIdUsername({
        path: { orgId },
        body: requestBody,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () =>
        new Error("Username can only be changed once every 30 days."),
      [HTTP_STATUS.CONFLICT]: () => new Error("Username is not unique. Choose another one!"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to update username"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Only owners and admins can update username"),
    },
  );
};
