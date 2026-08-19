import {authV1TokenServiceRefreshToken, authV1ProvidersServiceConnectProvider} from "../../generated";
import {AuthProvider} from "@/providers";
import type {TokenResponse, LimitedScopeTokenResponse} from "../types";
import {normalizeProviderType, toProtoProvider} from "../social/socialConnections";

export type {TokenResponse, LimitedScopeTokenResponse};

export interface RefreshTokenOptions {
  countryCode?: string;
  origin?: string;
}

/**
 * Exchange a provider credential for a Rixl session, or refresh an existing
 * Rixl session with a Bearer refresh token.
 *
 * - For `AuthProvider.BEARER`, the call hits `/auth/v1/token` with the stored
 *   Rixl refresh token.
 * - For OAuth/Telegram providers, the call hits `/auth/v1/providers/connect`
 *   with the provider's `id_token` or Telegram payload. The wire `provider`
 *   value is the `auth.v1.ExternalAccountProvider` enum (e.g.
 *   `EXTERNAL_ACCOUNT_PROVIDER_GOOGLE`), not the short SDK name.
 */
export const refreshTokens = async (
  provider: AuthProvider,
  token: string,
  options?: RefreshTokenOptions
): Promise<TokenResponse | LimitedScopeTokenResponse> => {
  if (provider === AuthProvider.BEARER) {
    const {data} = await authV1TokenServiceRefreshToken({
      body: {
        token_type: "Bearer",
        refresh_token: token,
        country_code: options?.countryCode,
        origin: options?.origin,
      },
      throwOnError: true,
    });
    return data as TokenResponse | LimitedScopeTokenResponse;
  }

  const requestProvider = normalizeProviderType(provider);
  const {data} = await authV1ProvidersServiceConnectProvider({
    body: {
      provider: toProtoProvider(requestProvider),
      token,
      country_code: options?.countryCode,
      origin: options?.origin,
    },
    throwOnError: true,
  });
  return data as TokenResponse | LimitedScopeTokenResponse;
};
