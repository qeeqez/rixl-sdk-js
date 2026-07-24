import {
  authV1UserServiceUpdateName,
  authV1UserServiceUpdateUsername,
  authV1OtpServiceGetOtpStatus,
  authV1OtpServiceSetupOtp,
  authV1OtpServiceVerifyOtp,
  authV1OtpServiceDeleteOtp,
} from "../generated/sdk.gen";
import {validateInput} from "./validation/base";
import {UpdateNameSchema, UpdateUsernameSchema} from "./validation/user";
import {VerifyOTPCodeSchema} from "./validation/auth";
import {apiCall} from "./api/utils";
import {setTokensFromWire} from "./api/wire-tokens";
import {HTTP_STATUS} from "./constants";

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
      const validatedInput = validateInput(UpdateNameSchema, {fullName});
      await authV1UserServiceUpdateName({
        body: validatedInput,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid name format"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to update name"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Name can only be changed once every 7 days."),
    }
  );
};

export const updateUsername = async (username: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(UpdateUsernameSchema, {username});
      await authV1UserServiceUpdateUsername({
        body: validatedInput,
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid username format"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to update username"),
      [HTTP_STATUS.CONFLICT]: () => new Error("Username is not unique. Choose another one!"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Username can only be changed once every 30 days."),
    }
  );
};

export const getOTPStatus = async (): Promise<OTPStatusResponse> => {
  return apiCall(
    async () => {
      const {data} = await authV1OtpServiceGetOtpStatus({
        throwOnError: true,
      });

      const wire = data as {is_setup?: boolean; created_at?: string};
      return {
        is_setup: wire.is_setup ?? false,
        created_at: wire.created_at,
      };
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Token is missing or invalid; user is not authenticated."),
    }
  );
};

export const setupUserOTP = async (): Promise<OTPSetup> => {
  return apiCall(
    async () => {
      const {data} = await authV1OtpServiceSetupOtp({
        throwOnError: true,
      });

      const wire = data as {qr_code_url?: string; secret?: string};
      return {
        qrCodeUrl: wire.qr_code_url || "",
        secret: wire.secret || "",
      };
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Token is missing or invalid; user is not authenticated."),
    }
  );
};

export const verifyUserOTP = async (code: string): Promise<void> => {
  return apiCall(
    async () => {
      const validatedBody = validateInput(VerifyOTPCodeSchema, {code});
      const {data} = await authV1OtpServiceVerifyOtp({
        body: validatedBody,
        throwOnError: true,
      });

      setTokensFromWire(data);
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid request format"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Token is missing or invalid; user is not authenticated."),
    }
  );
};

export const deleteUserOTP = async (): Promise<void> => {
  return apiCall(
    async () => {
      await authV1OtpServiceDeleteOtp({
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Token is missing or invalid; user is not authenticated."),
    }
  );
};
