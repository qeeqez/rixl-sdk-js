import { updateEntityField } from "./utils/nameUpdates";
import { performOTPOperation } from "./utils/otpOperations";
import { validateInput } from "./validation/base";
import { VerifyOTPCodeSchema } from "./validation/auth";

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

/**
 * Updates the current user's full name
 * @param fullName The new full name (1-30 characters)
 * @returns A promise that resolves when the name is updated
 * @throws Error if the name is invalid or can't be changed yet (once per 7 days)
 */
export const updateFullName = async (fullName: string): Promise<void> => {
  return updateEntityField({
    value: fullName,
    type: "name",
    endpoint: "users/current/name",
    handleTokenRefresh: true,
  });
};

/**
 * Updates the current user's username
 * @param username The new username (4-24 characters, only letters, numbers, underscores, and periods)
 * @returns A promise that resolves when the username is updated
 * @throws Error if the username is invalid, not unique, or can't be changed yet (once per 30 days)
 */
export const updateUsername = async (username: string): Promise<void> => {
  return updateEntityField({
    value: username,
    type: "username",
    endpoint: "users/current/username",
    handleTokenRefresh: true,
  });
};

/**
 * Get user otp status
 * @returns A promise that resolves to the OTP status object
 * @throws Error if the OTP status can't be retrieved
 */
export const getOTPStatus = async (): Promise<OTPStatusResponse> => {
  return performOTPOperation<OTPStatusResponse>({
    endpoint: "users/current/totp/status",
    method: "GET",
    handleNoOTP: (message) => ({
      is_setup: false,
      message,
      created_at: undefined,
    }),
  });
};

/**
 * Setup user otp
 * @returns A promise that resolves to the OTP setup data (QR code link and secret)
 * @throws Error if the OTP QR code can't be retrieved
 */
export const setupUserOTP = async (): Promise<OTPSetup> => {
  return performOTPOperation<OTPSetup>({
    endpoint: "users/current/totp/setup",
    method: "POST",
  });
};

/**
 * Verify user OTP code
 * @param code The OTP code to verify
 * @returns A promise that resolves when the code is verified
 * @throws Error if the code can't be verified
 */
export const verifyUserOTP = async (code: string): Promise<void> => {
  const validatedBody = validateInput(VerifyOTPCodeSchema, { code });
  await performOTPOperation<void>({
    endpoint: "users/current/totp/verify",
    method: "POST",
    body: validatedBody,
    handleTokenRefresh: true,
  });
};

/**
 * Delete user OTP setup
 * @returns A promise that resolves when the OTP setup is deleted
 * @throws Error if the OTP setup can't be deleted
 */
export const deleteUserOTP = async (): Promise<void> => {
  await performOTPOperation<void>({
    endpoint: "users/current/totp/delete",
    method: "DELETE",
  });
};
