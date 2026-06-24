import { postAuthV1Token } from "@rixl/sdk";
import { AuthProvider } from "../providers";
import { LimitedScopeTokenResponse } from "../types";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const refreshTokens = async (
  provider: AuthProvider,
  token: string,
): Promise<TokenResponse | LimitedScopeTokenResponse> => {
  const { data } = await postAuthV1Token({
    headers: { Authorization: `${provider} ${token}` },
    throwOnError: true,
  });
  return data as unknown as TokenResponse | LimitedScopeTokenResponse;
};
