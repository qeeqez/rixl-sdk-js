import { publicFetch } from "./fetchers";
import { AuthProvider } from "../providers";
import { LimitedScopeTokenResponse } from "../types";

/**
 * Response from the token refresh endpoint
 */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Refreshes tokens with the backend
 * @param provider The authentication provider (e.g., AuthProvider.BEARER, AuthProvider.GOOGLE)
 * @param token The refresh token or provider ID token
 * @returns Promise with the new tokens (full or limited scope)
 */
export const refreshTokens = async (
  provider: AuthProvider,
  token: string,
): Promise<TokenResponse | LimitedScopeTokenResponse> => {
  return publicFetch<TokenResponse | LimitedScopeTokenResponse>("token", {
    method: "POST",
    headers: {
      Authorization: `${provider} ${token}`,
    },
  });
};
