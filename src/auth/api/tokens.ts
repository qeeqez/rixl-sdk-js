import {setTokens} from "../authStore";

interface TokenFields {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number | string;
}

// Persists tokens when a response carries all three fields.
export function persistTokens(data: TokenFields | null | undefined): boolean {
  const tokens = data ?? {};
  if (tokens.access_token && tokens.refresh_token && tokens.expires_in) {
    setTokens(tokens.access_token, tokens.refresh_token, Number(tokens.expires_in));
    return true;
  }
  return false;
}
