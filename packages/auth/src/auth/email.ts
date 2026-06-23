import { getToken, setTokens, limitedAccessToken } from "../authStore";
import {
  ChangeEmailRequestSchema,
  ResendEmailRequestSchema,
  verifyEmailChangeRequestSchema,
} from "../validation/auth";
import { authenticatedFetch, publicFetch } from "../api/fetchers";
import { validateInput } from "../validation/base";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { RegistrationResponse, VerifyEmailResponse, VerifyStatusResponse } from "./types";
import { EmailVerificationType } from "../types";

export const initiateEmailChange = async (email: string): Promise<void | RegistrationResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ChangeEmailRequestSchema, { new_email: email });
      return await authenticatedFetch<RegistrationResponse>("auth/email/change", getToken, {
        method: "POST",
        body: validatedInput,
      });
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid email or email already in use"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Unauthorized - invalid or missing token"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () =>
        new Error("Too many requests - please try again later"),
    },
  );
};

/**
 * Adds an email address to a user account in limited access state.
 *
 * Call this when `requiresAction` is `"add_email"` (e.g., Telegram users who authenticated
 * without an email). Uses the `limitedAccessToken` for authentication; falls back to
 * public endpoint for legacy/unauthenticated flows.
 *
 * @param email Email address to add
 * @returns A promise that resolves with verification_id when email is added
 * @throws Error if email is invalid, already in use, rate limited, or unauthorized
 */
export const addEmail = async (email: string): Promise<void | RegistrationResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ResendEmailRequestSchema, { email });

      // Use limitedAccessToken for Telegram users who are authenticated but need to add email
      const token = limitedAccessToken.get();
      if (token) {
        return await authenticatedFetch<RegistrationResponse>("auth/email/add", async () => token, {
          method: "POST",
          body: validatedInput,
        });
      }

      // Fallback to public endpoint (legacy flow or unauthenticated)
      return await publicFetch<RegistrationResponse>("auth/email/add", {
        method: "POST",
        body: validatedInput,
      });
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid email address"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Session expired - please login again"),
      [HTTP_STATUS.CONFLICT]: () => new Error("Email address is already in use"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () =>
        new Error("Too many requests - please try again later"),
    },
  );
};

export interface VerifyEmailWithCodeParams {
  code: string;
  type: EmailVerificationType;
  verification_id: string;
  new_email: string;
}

const normalizeVerifyEmailArgs = (
  args: [VerifyEmailWithCodeParams] | [string, EmailVerificationType, string, string],
): VerifyEmailWithCodeParams => {
  if (isLegacyVerifyEmailArgs(args)) {
    const [code, type, verification_id, new_email] = args;
    return { code, type, verification_id, new_email };
  }

  return args[0];
};

const isLegacyVerifyEmailArgs = (
  args: [VerifyEmailWithCodeParams] | [string, EmailVerificationType, string, string],
): args is [string, EmailVerificationType, string, string] => typeof args[0] === "string";

export const verifyEmailWithCode = async (
  ...args: [VerifyEmailWithCodeParams] | [string, EmailVerificationType, string, string]
): Promise<void | VerifyEmailResponse> => {
  return apiCall(
    async () => {
      const payload = normalizeVerifyEmailArgs(args);

      const validatedInput = validateInput(verifyEmailChangeRequestSchema, payload);
      const data = await publicFetch<VerifyEmailResponse>("auth/email/verify", {
        method: "POST",
        body: validatedInput,
      });

      // Set tokens if returned (for login after email verification)
      // Note: setTokens automatically clears limited access state
      if (data.tokens?.access_token && data.tokens?.refresh_token && data.tokens?.expires_in) {
        setTokens(data.tokens.access_token, data.tokens.refresh_token, data.tokens.expires_in);
      }

      return data;
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid code or verification ID"),
    },
  );
};

export const getEmailVerificationStatus = async (): Promise<void | VerifyStatusResponse> => {
  return apiCall(
    async () => {
      return await authenticatedFetch<VerifyStatusResponse>("auth/email/status", getToken, {
        method: "GET",
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Unauthorized - invalid or missing token"),
    },
  );
};
