import { postAuthV1Login, postAuthV1VerifyTotp } from "@rixl/sdk";
import { setTokens } from "../authStore";
import { EmailAuthRequestSchema, LoginOTPVerifyRequestSchema } from "../validation/auth";
import { validateInput } from "../validation/base";
import { ApiError } from "../api/error-handlers";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { LoginErrorResponse, OTPVerificationResponse } from "./types";
import type { Authv1LoginResponse, ErrorsErrorResponse } from "@rixl/sdk";

export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<void | OTPVerificationResponse | LoginErrorResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(EmailAuthRequestSchema, { email, password });
      try {
        const { data } = await postAuthV1Login({
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
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid password format"),
    },
  );
};

export const verifyTOTPForLogin = async (code: string, session_id: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(LoginOTPVerifyRequestSchema, { code, session_id });
      const { data } = await postAuthV1VerifyTotp({
        body: validatedInput,
        throwOnError: true,
      });

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

function handleLoginResponse(
  data: Authv1LoginResponse,
  email: string,
): void | OTPVerificationResponse | LoginErrorResponse {
  switch (data.status) {
    case "ok":
      if (data.tokens?.access_token && data.tokens.refresh_token && data.tokens.expires_in) {
        setTokens(data.tokens.access_token, data.tokens.refresh_token, data.tokens.expires_in);
      }
      return;
    case "otp_required":
      return {
        message: "OTP verification required",
        session_id: data.session_id!,
        totp_required: true,
      };
    case "email_not_verified":
      return {
        error_code: "email_not_verified",
        message: "Email not verified",
        email: data.email || email,
      };
    default:
      return;
  }
}

function handleLoginError(
  error: unknown,
  email: string,
): OTPVerificationResponse | LoginErrorResponse | never {
  if (isErrorResponse(error)) {
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

function isErrorResponse(error: unknown): error is ErrorsErrorResponse & { code: number } {
  return typeof error === "object" && error !== null && "error" in error;
}
