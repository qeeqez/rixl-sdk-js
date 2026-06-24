import {
  putAuthV1UsersCurrentEmailsChange,
  postAuthV1UsersCurrentEmails,
  postAuthV1EmailVerify,
  getAuthV1UsersCurrentEmailsStatus,
} from "../../generated/sdk.gen";
import {setTokens} from "../authStore";
import {ChangeEmailRequestSchema, ResendEmailRequestSchema, verifyEmailChangeRequestSchema} from "../validation/auth";
import {validateInput} from "../validation/base";
import {apiCall} from "../api/utils";
import {HTTP_STATUS} from "../constants";
import type {RegistrationResponse, VerifyEmailResponse, VerifyStatusResponse} from "./types";
import type {EmailVerificationType} from "../types";

export const initiateEmailChange = async (email: string): Promise<void | RegistrationResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ChangeEmailRequestSchema, {new_email: email});
      const {data} = await putAuthV1UsersCurrentEmailsChange({
        body: validatedInput,
        throwOnError: true,
      });

      if (data.verification_id) {
        return {
          message: data.message || "Verification code sent",
          verification_id: data.verification_id,
        };
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid email or email already in use"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Unauthorized - invalid or missing token"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Too many requests - please try again later"),
    }
  );
};

export const addEmail = async (email: string): Promise<void | RegistrationResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ResendEmailRequestSchema, {email});
      const {data} = await postAuthV1UsersCurrentEmails({
        body: validatedInput,
        throwOnError: true,
      });

      if (data.verification_id) {
        return {
          message: data.message || "Verification code sent",
          verification_id: data.verification_id,
        };
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid email address"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Session expired - please login again"),
      [HTTP_STATUS.CONFLICT]: () => new Error("Email address is already in use"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Too many requests - please try again later"),
    }
  );
};

export interface VerifyEmailWithCodeParams {
  code: string;
  type: EmailVerificationType;
  verification_id: string;
  new_email: string;
}

const normalizeVerifyEmailArgs = (
  args: [VerifyEmailWithCodeParams] | [string, EmailVerificationType, string, string]
): VerifyEmailWithCodeParams => {
  if (isLegacyVerifyEmailArgs(args)) {
    const [code, type, verification_id, new_email] = args;
    return {code, type, verification_id, new_email};
  }

  return args[0];
};

const isLegacyVerifyEmailArgs = (
  args: [VerifyEmailWithCodeParams] | [string, EmailVerificationType, string, string]
): args is [string, EmailVerificationType, string, string] => typeof args[0] === "string";

export const verifyEmailWithCode = async (
  ...args: [VerifyEmailWithCodeParams] | [string, EmailVerificationType, string, string]
): Promise<void | VerifyEmailResponse> => {
  return apiCall(
    async () => {
      const payload = normalizeVerifyEmailArgs(args);

      validateInput(verifyEmailChangeRequestSchema, payload);
      const {data} = await postAuthV1EmailVerify({
        body: {code: payload.code, verification_id: payload.verification_id},
        throwOnError: true,
      });

      if (data.tokens?.access_token && data.tokens?.refresh_token && data.tokens?.expires_in) {
        setTokens(data.tokens.access_token, data.tokens.refresh_token, data.tokens.expires_in);
      }

      return {
        email: data.email || "",
        message: data.message || "Email verified",
        verified: data.verified || false,
        tokens: data.tokens
          ? {
              access_token: data.tokens.access_token!,
              refresh_token: data.tokens.refresh_token!,
              expires_in: data.tokens.expires_in!,
            }
          : undefined,
      };
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid code or verification ID"),
    }
  );
};

export const getEmailVerificationStatus = async (): Promise<void | VerifyStatusResponse> => {
  return apiCall(
    async () => {
      const {data} = await getAuthV1UsersCurrentEmailsStatus({
        throwOnError: true,
      });

      return {
        email: data.email || "",
        has_email: String(data.has_email ?? false),
        verified: data.verified || false,
      };
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Unauthorized - invalid or missing token"),
    }
  );
};
