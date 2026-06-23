import {
  patchAuthV1UsersCurrentName,
  patchAuthV1UsersCurrentUsername,
  getAuthV1UsersCurrentTotpStatus,
  postAuthV1UsersCurrentTotpSetup,
  postAuthV1UsersCurrentTotpVerify,
  deleteAuthV1UsersCurrentTotpDelete,
} from "@rixl/sdk";
import { setTokens } from "./authStore";
import { validateInput } from "./validation/base";
import { UpdateNameSchema, UpdateUsernameSchema } from "./validation/user";
import { VerifyOTPCodeSchema } from "./validation/auth";
import { apiCall } from "./api/utils";
import { HTTP_STATUS } from "./constants";

export interface OTPSetup {
  qrCodeUrl: string;
  secret: string;
}

export interface OTPStatusResponse {
  is_setup: boolean;
  created_at?: string;
  message?: string;
}

export interface OTPVerification {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}

export const updateFullName = async (fullName: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(UpdateNameSchema, { full_name: fullName });
      const { data } = await patchAuthV1UsersCurrentName({
        body: validatedInput,
        throwOnError: true,
      });

      if (data && "access_token" in data) {
        const tokenData = data as unknown as {
          access_token: string;
          refresh_token: string;
          expires_in: number;
        };
        if (tokenData.access_token && tokenData.refresh_token && tokenData.expires_in) {
          setTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);
        }
      }
    },
    {
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () =>
        new Error("Name can only be changed once every 7 days."),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to update name"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Only owners and admins can update name"),
    },
  );
};

export const updateUsername = async (username: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(UpdateUsernameSchema, { username });
      const { data } = await patchAuthV1UsersCurrentUsername({
        body: validatedInput,
        throwOnError: true,
      });

      if (data && "access_token" in data) {
        const tokenData = data as unknown as {
          access_token: string;
          refresh_token: string;
          expires_in: number;
        };
        if (tokenData.access_token && tokenData.refresh_token && tokenData.expires_in) {
          setTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);
        }
      }
    },
    {
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () =>
        new Error("Username can only be changed once every 30 days."),
      [HTTP_STATUS.CONFLICT]: () => new Error("Username is not unique. Choose another one!"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to update username"),
      [HTTP_STATUS.FORBIDDEN]: () => new Error("Only owners and admins can update username"),
    },
  );
};

export const getOTPStatus = async (): Promise<OTPStatusResponse> => {
  return apiCall(
    async () => {
      const { data } = await getAuthV1UsersCurrentTotpStatus({
        throwOnError: true,
      });

      return {
        is_setup: data.is_setup ?? false,
        created_at: data.created_at,
        message: data.message,
      };
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid request format"),
      [HTTP_STATUS.UNAUTHORIZED]: () =>
        new Error("Token is missing or invalid; user is not authenticated."),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("User record does not exist."),
    },
  );
};

export const setupUserOTP = async (): Promise<OTPSetup> => {
  return apiCall(
    async () => {
      const { data } = await postAuthV1UsersCurrentTotpSetup({
        throwOnError: true,
      });

      return {
        qrCodeUrl: data.qr_code_url || "",
        secret: data.secret || "",
      };
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid request format"),
      [HTTP_STATUS.UNAUTHORIZED]: () =>
        new Error("Token is missing or invalid; user is not authenticated."),
    },
  );
};

export const verifyUserOTP = async (code: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedBody = validateInput(VerifyOTPCodeSchema, { code });
      const { data } = await postAuthV1UsersCurrentTotpVerify({
        body: validatedBody,
        throwOnError: true,
      });

      if (data.access_token && data.refresh_token && data.expires_in) {
        setTokens(data.access_token, data.refresh_token, data.expires_in);
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid request format"),
      [HTTP_STATUS.UNAUTHORIZED]: () =>
        new Error("Token is missing or invalid; user is not authenticated."),
    },
  );
};

export const deleteUserOTP = async (): Promise<void> => {
  return apiCall(
    async () => {
      await deleteAuthV1UsersCurrentTotpDelete({
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () =>
        new Error("Token is missing or invalid; user is not authenticated."),
    },
  );
};
