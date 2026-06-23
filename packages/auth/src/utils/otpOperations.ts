import { getToken, setTokens } from "../authStore";
import { authenticatedFetch } from "../api/fetchers";
import { ApiError } from "../api/types";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { TokenResponse, HttpMethod } from "../types";

export interface OTPOperationOptions<T> {
  endpoint: string;
  method: Extract<HttpMethod, "GET" | "POST" | "DELETE">;
  body?: Record<string, unknown>;
  handleTokenRefresh?: boolean;
  handleNoOTP?: (message: string) => T;
}

const applyTokenRefresh = (response: unknown, handleTokenRefresh: boolean): void => {
  if (!handleTokenRefresh || !response || typeof response !== "object") return;

  const tokenResponse = response as TokenResponse;
  if (tokenResponse.access_token && tokenResponse.refresh_token && tokenResponse.expires_in) {
    setTokens(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
  }
};

const handleOtpError = <T>(error: unknown, handleNoOTP?: (message: string) => T): T | undefined => {
  if (error instanceof ApiError && error.status === HTTP_STATUS.ACCEPTED && handleNoOTP) {
    return handleNoOTP("No OTP setup found");
  }

  return undefined;
};

/**
 * Generic function to perform OTP-related operations
 * @param options The options for the OTP operation
 * @returns A promise that resolves to the operation result
 * @throws Error if the operation fails
 */
export const performOTPOperation = async <T>(options: OTPOperationOptions<T>): Promise<T> => {
  const { endpoint, method, body, handleTokenRefresh = false, handleNoOTP } = options;

  return apiCall(
    async () => {
      try {
        const response = await authenticatedFetch<T & Partial<TokenResponse>>(endpoint, getToken, {
          method,
          body,
        });

        applyTokenRefresh(response, handleTokenRefresh);
        return response as T;
      } catch (error) {
        const handled = handleOtpError<T>(error, handleNoOTP);
        if (handled !== undefined) {
          return handled;
        }
        throw error;
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid request format"),
      [HTTP_STATUS.UNAUTHORIZED]: () =>
        new Error("Token is missing or invalid; user is not authenticated."),
      [HTTP_STATUS.FORBIDDEN]: () =>
        new Error("User exists but is not active (not allowed to access OTP status)"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("User record does not exist."),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("User is sending too many requests."),
    },
  );
};
