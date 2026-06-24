import { HTTP_STATUS } from "../constants";
import { ApiError, type ApiRequestConfig } from "./types";
import { baseFetch } from "./base";
import { createKyInstance } from "./client-core";

/**
 * Makes an authenticated API request using ky.
 * Legacy — retained only for endpoints not yet in the gateway swagger.
 */
export const authenticatedFetch = async <T>(
  endpoint: string,
  getTokenFn: () => Promise<string | undefined>,
  config: ApiRequestConfig = {},
): Promise<T> => {
  return baseFetch<T>(endpoint, config, async () => {
    const token = await getTokenFn();
    if (!token && !config.skipAuth) {
      throw new ApiError("No authentication token available", {
        status: HTTP_STATUS.UNAUTHORIZED,
        endpoint,
      });
    }
    return createKyInstance(getTokenFn, config.skipAuth);
  });
};
