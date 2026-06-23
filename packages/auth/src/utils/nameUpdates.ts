import { getToken, setTokens } from "../authStore";
import { authenticatedFetch } from "../api/fetchers";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { TokenResponse, HttpMethod, EntityUpdateType } from "../types";
import { validateInput } from "../validation/base";
import { UpdateUsernameSchema, UpdateNameSchema } from "../validation/user";

interface UpdateNameOptions {
  value: string;
  type: EntityUpdateType;
  endpoint: string;
  method?: Extract<HttpMethod, "PUT" | "PATCH">;
  handleTokenRefresh?: boolean;
}

export const updateEntityField = async ({
  value,
  type,
  endpoint,
  method = "PATCH",
  handleTokenRefresh = false,
}: UpdateNameOptions): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody =
        type === "username"
          ? validateInput(UpdateUsernameSchema, { username: value })
          : validateInput(UpdateNameSchema, { full_name: value });

      const response = await authenticatedFetch<TokenResponse | void>(endpoint, getToken, {
        method,
        body: requestBody,
      });

      // Handle token refresh if needed
      if (handleTokenRefresh && response && typeof response === "object") {
        const tokenResponse = response as TokenResponse;
        if (tokenResponse.access_token && tokenResponse.refresh_token && tokenResponse.expires_in) {
          setTokens(
            tokenResponse.access_token,
            tokenResponse.refresh_token,
            tokenResponse.expires_in,
          );
        }
      }
    },
    {
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () =>
        new Error(
          `${type === "name" ? "Name" : "Username"} can only be changed once every ${type === "name" ? "7" : "30"} days.`,
        ),
      [HTTP_STATUS.CONFLICT]: () =>
        type === "username"
          ? new Error("Username is not unique. Choose another one!")
          : new Error(`Failed to update ${type}`),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error(`User is not authorized to update ${type}`),
      [HTTP_STATUS.FORBIDDEN]: () => new Error(`Only owners and admins can update ${type}`),
    },
  );
};
