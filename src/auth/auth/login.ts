import {authV1EmailServiceLogin, authV1OtpServiceVerifyTotpForLogin} from "../../generated/sdk.gen";
import {EmailAuthRequestSchema, LoginOTPVerifyRequestSchema} from "../validation/auth";
import {validateInput} from "../validation/base";
import {ApiError} from "../api/error-handlers";
import {apiCall} from "../api/utils";
import {setTokensFromWire} from "../api/wire-tokens";
import {HTTP_STATUS} from "../constants";
import type {LoginErrorResponse, TwoFactorResponse} from "./types";
import type {AuthV1LoginResponse} from "../../generated/types.gen";

export const loginWithEmail = async (email: string, password: string): Promise<void | TwoFactorResponse | LoginErrorResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(EmailAuthRequestSchema, {email, password});
      try {
        const {data} = await authV1EmailServiceLogin({
          body: validatedInput,
          throwOnError: true,
        });

        return handleLoginResponse(data, email);
      } catch (error) {
        return handleLoginError(error, email);
      }
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Incorrect email or password"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Account access is restricted"),
    }
  );
};

export const verifyTOTPForLogin = async (code: string, session_id: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(LoginOTPVerifyRequestSchema, {code, sessionId: session_id});
      const {data} = await authV1OtpServiceVerifyTotpForLogin({
        body: validatedInput,
        throwOnError: true,
      });

      setTokensFromWire(data);
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Invalid or expired TOTP code"),
    }
  );
};

// The gateway serializes responses in snake_case, but the generated types model
// them in camelCase. Read the wire shape directly for the fields we consume.
interface WireLoginResponse {
  session_id?: string;
  authentication?: string[];
  passkey_options?: object;
  email?: string;
}

function handleLoginResponse(data: AuthV1LoginResponse, email: string): void | TwoFactorResponse | LoginErrorResponse {
  const wire = data as WireLoginResponse;
  switch (data.status) {
    case "ok":
      setTokensFromWire(data);
      return;
    case "2fa_required":
      return {
        session_id: wire.session_id!,
        email: email,
        authentication: wire.authentication as TwoFactorResponse["authentication"],
        passkey_options: wire.passkey_options,
      };
    case "otp_required":
      return {
        session_id: wire.session_id!,
        email: email,
        authentication: ["totp"],
      } satisfies TwoFactorResponse;
    case "email_not_verified":
      return {
        error_code: "email_not_verified",
        message: "Email not verified",
        email: wire.email || email,
      };
    default:
      return;
  }
}

interface ApiErrorBody {
  error?: string;
  details?: string;
  code?: number;
}

function handleLoginError(error: unknown, email: string): TwoFactorResponse | LoginErrorResponse | never {
  if (isApiErrorBody(error)) {
    if (error.error === "email_not_verified") {
      return {
        error_code: "email_not_verified",
        message: error.details || "Email not verified",
        email,
      };
    }
    if (error.error === "provider_conflict") {
      return {
        error_code: "provider_conflict",
        message: error.details || "Email registered with different provider",
        email,
      };
    }
    throw new ApiError(error.error || "Login failed", error.code || 500, "/auth/v1/login", error);
  }
  throw error;
}

function isApiErrorBody(error: unknown): error is ApiErrorBody {
  return typeof error === "object" && error !== null && "error" in error;
}
