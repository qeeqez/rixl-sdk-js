import ky from "ky";
import { apiURL } from "../api-url";
import { HTTP_STATUS } from "../constants";
import { ApiError, type ApiRequestConfig } from "./types";
import { baseFetch } from "./base";
import { createKyInstance } from "./client-core";

/**
 * Makes an authenticated API request using ky
 * @param endpoint The API endpoint (relative to base URL)
 * @param getTokenFn Function to retrieve the auth token
 * @param config Request configuration
 * @returns Promise with the response data
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

/**
 * Makes a public (non-authenticated) API request using ky
 * @param endpoint The API endpoint (relative to base URL)
 * @param config Request configuration
 * @returns Promise with the response data
 */
export const publicFetch = async <T>(
  endpoint: string,
  config: ApiRequestConfig = {},
): Promise<T> => {
  return baseFetch<T>(endpoint, config, async () => {
    // Create a simple ky instance without auth hooks for public endpoints
    return ky.create({
      prefix: apiURL.get(),
      retry: 2,
    });
  });
};
