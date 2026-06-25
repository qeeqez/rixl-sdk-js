import {postAuthV1Register, postAuthV1EmailVerifyResend} from "../../generated/sdk.gen";
import {validateInput} from "../validation/base";
import {EmailAuthRequestSchema, ResendEmailRequestSchema} from "../validation/auth";
import {apiCall} from "../api/utils";
import {HTTP_STATUS} from "../constants";
import type {RegistrationResponse, VerificationSentResponse} from "./types";

export const registerWithEmail = async (
  email: string,
  password: string,
  subscribeToBlog?: boolean
): Promise<void | RegistrationResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(EmailAuthRequestSchema, {
        email,
        password,
        subscribe_to_blog: subscribeToBlog,
      });
      const {data} = await postAuthV1Register({
        body: validatedInput,
        throwOnError: true,
      });

      if (data.verification_id) {
        return {
          message: data.message || "Registration successful",
          verification_id: data.verification_id,
          email_verification_sent: data.email_verification_sent,
          user_id: data.user_id,
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
      const {data} = await postAuthV1EmailVerifyResend({
        body: validatedInput,
        throwOnError: true,
      });

      if (data.verification_id) {
        return {
          message: data.message || "Verification code resent",
          verification_id: data.verification_id,
          code_sent: data.code_sent,
        };
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid email or validation error"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Too many requests - rate limit exceeded"),
    }
  );
};
