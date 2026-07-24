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
    body: {tokenType: provider, refreshToken: token, ...options},
    throwOnError: true,
  });
  return data as TokenResponse | LimitedScopeTokenResponse;
};
