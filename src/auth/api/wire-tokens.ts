import {setTokens} from "../authStore";

// The RIXL gateway serializes responses in snake_case (proto field names), but
// the generated SDK types model them in camelCase. Read the wire shape directly
// for the token fields we consume, and persist them when all three are present.
export interface WireTokens {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number | string;
}

export function setTokensFromWire(data: unknown): boolean {
  const tokens = (data ?? {}) as WireTokens;
  if (tokens.access_token && tokens.refresh_token && tokens.expires_in) {
    setTokens(tokens.access_token, tokens.refresh_token, Number(tokens.expires_in));
    return true;
  }
  return false;
}

export function readWireSessionId(data: unknown): string | undefined {
  return (data as {session_id?: string} | null | undefined)?.session_id;
}
