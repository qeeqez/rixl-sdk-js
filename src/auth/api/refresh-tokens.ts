import {authV1TokenServiceRefreshToken} from "../../generated";
import {AuthProvider} from "@/providers";
import type {TokenResponse, LimitedScopeTokenResponse} from "../types";
import type {AuthV1ExternalAccountProvider} from "../../generated";

export type {TokenResponse, LimitedScopeTokenResponse};

export interface RefreshTokenOptions {
  countryCode?: string;
  origin?: string;
}

type TokenType = "Bearer" | AuthV1ExternalAccountProvider;

const providerToTokenType: Record<AuthProvider, TokenType> = {
  [AuthProvider.BEARER]: "Bearer",
  [AuthProvider.GOOGLE]: "EXTERNAL_ACCOUNT_PROVIDER_GOOGLE",
  [AuthProvider.APPLE]: "EXTERNAL_ACCOUNT_PROVIDER_APPLE",
  [AuthProvider.MICROSOFT]: "EXTERNAL_ACCOUNT_PROVIDER_MICROSOFT",
  [AuthProvider.TELEGRAM_WEB]: "EXTERNAL_ACCOUNT_PROVIDER_TELEGRAM",
  [AuthProvider.TELEGRAM_MINI_APP]: "EXTERNAL_ACCOUNT_PROVIDER_TELEGRAM",
};

const toTokenType = (provider: AuthProvider): TokenType => providerToTokenType[provider] ?? provider;

export const refreshTokens = async (
  provider: AuthProvider,
  token: string,
  options?: RefreshTokenOptions
): Promise<TokenResponse | LimitedScopeTokenResponse> => {
  const {data} = await authV1TokenServiceRefreshToken({
    body: {
      token_type: toTokenType(provider),
      refresh_token: token,
      country_code: options?.countryCode,
      origin: options?.origin,
    },
    throwOnError: true,
  });
  return data as TokenResponse | LimitedScopeTokenResponse;
};
