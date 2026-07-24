import {
  authV1EmailServiceInitiateEmailChange,
  authV1EmailServiceAddEmail,
  authV1EmailServiceVerifyEmail,
  authV1EmailServiceGetUserEmailStatus,
} from "../../generated/sdk.gen";
import {ChangeEmailRequestSchema, ResendEmailRequestSchema, verifyEmailChangeRequestSchema} from "../validation/auth";
import {validateInput} from "../validation/base";
import {apiCall} from "../api/utils";
import {setTokensFromWire, type WireTokens} from "../api/wire-tokens";
import {HTTP_STATUS} from "../constants";
import type {VerificationSentResponse, VerifyEmailResponse, VerifyStatusResponse} from "./types";
import type {EmailVerificationType} from "../types";

// The gateway serializes responses in snake_case; the generated types are camelCase.
interface WireVerificationSent {
  message?: string;
  verification_id?: string;
  can_resend_at?: string;
  code_sent?: boolean;
}

interface WireEmailStatus {
  email?: string;
  has_email?: boolean;
  verified?: boolean;
}

export const initiateEmailChange = async (email: string): Promise<void | VerificationSentResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ChangeEmailRequestSchema, {newEmail: email});
      const {data} = await authV1EmailServiceInitiateEmailChange({
        body: validatedInput,
        throwOnError: true,
      });

      const wire = data as WireVerificationSent;
      if (wire.verification_id) {
        return {
          message: wire.message || "Verification code sent",
          verification_id: wire.verification_id,
          can_resend_at: wire.can_resend_at,
          code_sent: wire.code_sent,
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

export const addEmail = async (email: string): Promise<void | VerificationSentResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ResendEmailRequestSchema, {email});
      const {data} = await authV1EmailServiceAddEmail({
        body: validatedInput,
        throwOnError: true,
      });

      const wire = data as WireVerificationSent;
      if (wire.verification_id) {
        return {
          message: wire.message || "Verification code sent",
          verification_id: wire.verification_id,
          can_resend_at: wire.can_resend_at,
          code_sent: wire.code_sent,
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
      const {data} = await authV1EmailServiceVerifyEmail({
        body: {code: payload.code, verificationId: payload.verification_id},
        throwOnError: true,
      });

      const wireTokens = data.tokens as WireTokens | undefined;
      setTokensFromWire(wireTokens);

      return {
        email: data.email || "",
        message: data.message || "Email verified",
        verified: data.verified || false,
        tokens: wireTokens
          ? {
              access_token: wireTokens.access_token!,
              refresh_token: wireTokens.refresh_token!,
              expires_in: Number(wireTokens.expires_in!),
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
      const {data} = await authV1EmailServiceGetUserEmailStatus({
        throwOnError: true,
      });

      const wire = data as WireEmailStatus;
      return {
        email: wire.email || "",
        has_email: wire.has_email ?? false,
        verified: wire.verified || false,
      };
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Unauthorized - invalid or missing token"),
    }
  );
};
