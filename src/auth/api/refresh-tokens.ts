import {authV1TokenServiceRefreshToken} from "../../generated/sdk.gen";
import {AuthProvider} from "../providers";
import type {TokenResponse, LimitedScopeTokenResponse} from "../types";

export type {TokenResponse, LimitedScopeTokenResponse};

export const refreshTokens = async (provider: AuthProvider, token: string): Promise<TokenResponse | LimitedScopeTokenResponse> => {
  const {data} = await authV1TokenServiceRefreshToken({
    body: {},
    headers: {Authorization: `${provider} ${token}`},
    throwOnError: true,
  });
  return data as TokenResponse | LimitedScopeTokenResponse;
};
