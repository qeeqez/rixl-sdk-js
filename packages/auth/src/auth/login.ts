import { setTokens } from "../authStore";
import { TokenResponse } from "../types";
import { EmailAuthRequestSchema, LoginOTPVerifyRequestSchema } from "../validation/auth";
import { validateInput } from "../validation/base";
import { publicFetch } from "../api/fetchers";
import { ApiError } from "../api/error-handlers";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { LoginErrorResponse, OTPVerificationResponse } from "./types";

/**
 * Logs in a user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns A promise that resolves to:
 *   - void if login is successful
 *   - OTPVerificationResponse if 2FA is required
 *   - LoginErrorResponse if email not verified (403) or provider conflict (409)
 * @throws Error if login fails (incorrect credentials, etc.)
 */
export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<void | OTPVerificationResponse | LoginErrorResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(EmailAuthRequestSchema, { email, password });
      try {
        const data = await publicFetch<OTPVerificationResponse & Partial<TokenResponse>>(
          "auth/login",
          {
            method: "POST",
            body: validatedInput,
          },
        );

        // Update tokens from response for successful login
        if (data.access_token && data.refresh_token && data.expires_in) {
          setTokens(data.access_token, data.refresh_token, data.expires_in);
          return;
        }

        // Return OTP verification response if 2FA is required
        return data as OTPVerificationResponse;
      } catch (error) {
        if (error instanceof ApiError) {
          const handled = await handleLoginApiError(error, validatedInput, email);
          if (handled !== undefined) {
            return handled;
          }
        }
        throw error;
      }
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Incorrect email or password"),
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid password format"),
    },
  );
};

/**
 * Logs in a user after verifying OTP code and sessionID
 * @param code Code from User Authenticator app
 * @param session_id User's sessionID from login
 * @returns A promise that resolves when login is successful
 * @throws Error if login fails (incorrect credentials, etc.)
 */
export const verifyTOTPForLogin = async (code: string, session_id: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(LoginOTPVerifyRequestSchema, { code, session_id });
      const data = await publicFetch<TokenResponse>("verify-totp", {
        method: "POST",
        body: validatedInput,
      });

      // Update tokens from response
      if (data.access_token && data.refresh_token && data.expires_in) {
        setTokens(data.access_token, data.refresh_token, data.expires_in);
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () =>
        new Error("Bad request - Invalid code format, invalid code, or invalid session"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Session not found"),
    },
  );
};

type EmailAuthRequest = {
  email: string;
  password: string;
};

const buildEmailNotVerifiedResponse = (
  errorData: { error?: string; error_description?: string; email?: string } | undefined,
  fallbackEmail: string,
): LoginErrorResponse | undefined => {
  if (errorData?.error !== "email_not_verified") {
    return undefined;
  }

  return {
    error_code: "email_not_verified",
    message: errorData.error_description || "Email not verified",
    email: errorData.email || fallbackEmail,
  };
};

const handleLoginApiError = async (
  error: ApiError,
  validatedInput: EmailAuthRequest,
  email: string,
): Promise<OTPVerificationResponse | LoginErrorResponse | undefined> => {
  switch (error.status) {
    case HTTP_STATUS.ACCEPTED:
      return await publicFetch<OTPVerificationResponse>("auth/login", {
        method: "POST",
        body: validatedInput,
      });
    case HTTP_STATUS.FORBIDDEN:
      return buildEmailNotVerifiedResponse(
        error.data as { error?: string; error_description?: string; email?: string } | undefined,
        email,
      );
    case HTTP_STATUS.CONFLICT:
      return {
        error_code: "provider_conflict",
        message: error.message || "Email registered with different provider",
        email,
      };
    default:
      return undefined;
  }
};
