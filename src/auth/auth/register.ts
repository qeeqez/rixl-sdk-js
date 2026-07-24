import {authV1EmailServiceRegister, authV1EmailServiceResendVerification} from "../../generated/sdk.gen";
import {validateInput} from "../validation/base";
import {RegisterRequestSchema, ResendEmailRequestSchema} from "../validation/auth";
import {apiCall} from "../api/utils";
import {HTTP_STATUS} from "../constants";
import type {RegistrationResponse, VerificationSentResponse} from "./types";

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

      if (data.verificationId) {
        return {
          message: data.message || "Registration successful",
          verificationId: data.verificationId,
          emailVerificationSent: data.emailVerificationSent,
          userId: data.userId,
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

      if (data.verificationId) {
        return {
          message: data.message || "Verification code resent",
          verification_id: data.verificationId,
          code_sent: data.codeSent,
        };
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid email or validation error"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Too many requests - rate limit exceeded"),
    }
  );
};
