import {authV1EmailServiceRegister, authV1EmailServiceResendVerification} from "../../generated/sdk.gen";
import {validateInput} from "../validation/base";
import {RegisterRequestSchema, ResendEmailRequestSchema} from "../validation/auth";
import {apiCall} from "../api/utils";
import {HTTP_STATUS} from "../constants";
import type {RegistrationResponse, VerificationSentResponse} from "./types";

// The gateway serializes responses in snake_case, but the generated types model
// them in camelCase. Read the wire shape directly for the fields we consume.
interface WireRegisterResponse {
  message?: string;
  verification_id?: string;
  email_verification_sent?: boolean;
  user_id?: string;
}

interface WireVerificationSent {
  message?: string;
  verification_id?: string;
  code_sent?: boolean;
}

export const registerWithEmail = async (
  email: string,
  password: string,
  subscribeToBlog?: boolean,
  countryCode?: string
): Promise<void | RegistrationResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(RegisterRequestSchema, {
        email,
        password,
        countryCode,
        subscribeToBlog,
      });
      const {data} = await authV1EmailServiceRegister({
        body: validatedInput,
        throwOnError: true,
      });

      const wire = data as WireRegisterResponse;
      if (wire.verification_id) {
        return {
          message: wire.message || "Registration successful",
          verification_id: wire.verification_id,
          email_verification_sent: wire.email_verification_sent,
          user_id: wire.user_id,
        };
      }
    },
    {
      [HTTP_STATUS.CONFLICT]: () => new Error("Email address is already registered"),
    }
  );
};

export const resendEmailVerificationCode = async (email: string): Promise<void | VerificationSentResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ResendEmailRequestSchema, {email});
      const {data} = await authV1EmailServiceResendVerification({
        body: validatedInput,
        throwOnError: true,
      });

      const wire = data as WireVerificationSent;
      if (wire.verification_id) {
        return {
          message: wire.message || "Verification code resent",
          verification_id: wire.verification_id,
          code_sent: wire.code_sent,
        };
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid email or validation error"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Too many requests - rate limit exceeded"),
    }
  );
};
