import {authV1EmailServiceSendPasswordReset, authV1EmailServiceResetPassword} from "../../generated/sdk.gen";
import {ResendEmailRequestSchema, ResetPasswordRequestSchema} from "../validation/auth";
import {validateInput} from "../validation/base";
import {apiCall} from "../api/utils";
import {HTTP_STATUS} from "../constants";

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ResendEmailRequestSchema, {email});
      await authV1EmailServiceSendPasswordReset({
        body: validatedInput,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Bad request - invalid email or validation error"),
    }
  );
};

export const confirmPasswordReset = async (token: string, password: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ResetPasswordRequestSchema, {
        token: token,
        newPassword: password,
      });
      await authV1EmailServiceResetPassword({
        body: validatedInput,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Bad request - invalid token or password"),
    }
  );
};
