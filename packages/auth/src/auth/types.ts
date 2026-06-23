/** Interface for Login OTPVerificationResponse */
export interface OTPVerificationResponse {
  message: string;
  session_id: string;
  totp_required: boolean;
}

/** Interface for login verify OTP*/
export interface LoginOTPVerifyRequest {
  code: string;
  session_id: string;
}

export interface RegistrationResponse {
  message: string;
  verification_id: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface VerifyEmailResponse {
  email: string;
  message: string;
  verified: boolean;
  tokens?: Token;
}

export interface VerifyStatusResponse {
  email: string;
  has_email: string;
  verified: boolean;
}

/** Login error response for special cases that require UI action */
export type LoginErrorCode = "email_not_verified" | "provider_conflict";

export interface LoginErrorResponse {
  error_code: LoginErrorCode;
  message: string;
  email: string;
}

/**
 * OAuth 2.0 error response from token endpoint
 */
export interface OAuth2ErrorResponse {
  error: "invalid_grant" | string;
  error_description: string;
}
