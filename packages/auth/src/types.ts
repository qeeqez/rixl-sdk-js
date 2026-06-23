/**
 * Shared type definitions for the auth library
 */

/**
 * HTTP methods supported by the API client
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Entity types that can be updated (name/username)
 */
export type EntityUpdateType = "name" | "username";

/**
 * Email verification types
 */
export type EmailVerificationType = "verification" | "email_change";

/**
 * Cookie SameSite attribute values
 */
export type CookieSameSite = "strict" | "Strict" | "lax" | "Lax" | "none" | "None" | undefined;

/**
 * User type definition based on JWT payload
 */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  image_url: string;
  language_code: string;
  org_id: string;
}

/**
 * Response from token refresh/authentication
 */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Response from token endpoint for limited scope access (e.g., Telegram user without email)
 */
export interface LimitedScopeTokenResponse {
  access_token: string;
  token_type: "Bearer";
  scope: string;
  requires_action: "add_email";
}

/**
 * Actions that may be required from the user
 */
export type RequiresAction = "add_email" | null;
