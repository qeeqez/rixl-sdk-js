import {authV1TokenServiceRefreshToken} from "../../generated/sdk.gen";
import {AuthProvider} from "../providers";
import type {TokenResponse, LimitedScopeTokenResponse} from "../types";

export type {TokenResponse, LimitedScopeTokenResponse};

export interface RefreshTokenOptions {
  countryCode?: string;
  origin?: string;
}

export const refreshTokens = async (
  provider: AuthProvider,
  token: string,
  options?: RefreshTokenOptions
): Promise<TokenResponse | LimitedScopeTokenResponse> => {
  const {data} = await authV1TokenServiceRefreshToken({
    body: {
      token_type: provider,
      refresh_token: token,
      country_code: options?.countryCode,
      origin: options?.origin,
    },
    throwOnError: true,
  });
  return data as TokenResponse | LimitedScopeTokenResponse;
};
