import {
  authV1UserServiceUpdateName,
  authV1UserServiceUpdateUsername,
  authV1UserServiceGetUserInfo,
  authV1OtpServiceGetOtpStatus,
  authV1OtpServiceSetupOtp,
  authV1OtpServiceVerifyOtp,
  authV1OtpServiceDeleteOtp,
} from "../generated/sdk.gen";
import {validateInput} from "./validation/base";
import {UpdateNameSchema, UpdateUsernameSchema} from "./validation/user";
import {VerifyOTPCodeSchema} from "./validation/auth";
import {apiCall} from "./api/utils";
import {persistTokens} from "./api/tokens";
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

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  image_url: string;
  language_code: string;
  country_code: string;
  active_org_id: string;
}

// The gateway serializes responses in snake_case, but the generated types model
// them in camelCase. Read the wire shape directly for the fields we consume.
interface WireUserInfo {
  id?: string;
  username?: string;
  email?: string;
  email_verified?: boolean;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  language_code?: string;
  country_code?: string;
  active_org_id?: string;
}

export const getUserInfo = async (userId?: string): Promise<UserInfo> => {
  return apiCall(
    async () => {
      const {data} = await authV1UserServiceGetUserInfo({
        query: userId ? {userId} : undefined,
        throwOnError: true,
      });

      const wire = data as WireUserInfo;
      return {
        id: wire.id ?? "",
        username: wire.username ?? "",
        email: wire.email ?? "",
        email_verified: wire.email_verified ?? false,
        first_name: wire.first_name ?? "",
        last_name: wire.last_name ?? "",
        image_url: wire.image_url ?? "",
        language_code: wire.language_code ?? "",
        country_code: wire.country_code ?? "",
        active_org_id: wire.active_org_id ?? "",
      };
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Token is missing or invalid; user is not authenticated."),
    }
  );
};

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

      persistTokens(data);
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
