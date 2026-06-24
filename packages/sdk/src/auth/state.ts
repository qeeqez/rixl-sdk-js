import { STATE_STORAGE_KEY_PREFIX } from "./constants";

const storagePath = (provider: string) => STATE_STORAGE_KEY_PREFIX + provider;

/**
 * Retrieves and validates the OAuth state from session storage
 * @param provider The provider identifier
 * @param state The state value to validate
 * @returns True if the state is valid, false otherwise
 */
export function validateOAuthState(provider: string, state: string): boolean {
  const storedState = sessionStorage.getItem(storagePath(provider));
  return storedState === state;
}

/**
 * Gets or Generates a complete state parameter for OAuth requests
 * @param provider The identifier for the provider (e.g., 'google', 'apple')
 * @returns A state string containing the provider identifier and random data
 */
export function getOauthState(provider: string): string {
  return sessionStorage.getItem(storagePath(provider)) ?? generateOauthState(provider);
}

function generateOauthState(provider: string): string {
  const randomPart = crypto.randomUUID();
  const state = `${provider}_${randomPart}`;
  sessionStorage.setItem(storagePath(provider), state);
  return state;
}
