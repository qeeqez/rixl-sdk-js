import ky, { type KyInstance } from "ky";
import { apiURL } from "../api-url";

/**
 * Token refresh function type - will be set during initialization
 */
export type TokenRefreshFn = () => Promise<string | undefined>;
let tokenRefreshFunction: TokenRefreshFn | null = null;

/**
 * Mutex to prevent multiple simultaneous token refreshes
 */
let tokenRefreshPromise: Promise<string | undefined> | null = null;

/**
 * Resets the API client state - primarily for testing
 */
export const resetApiClient = (): void => {
  tokenRefreshFunction = null;
  tokenRefreshPromise = null;
};

/**
 * Sets the token refresh function used by the API client
 * This should be called during initialization
 */
export const setTokenRefreshFunction = (fn?: TokenRefreshFn): void => {
  tokenRefreshFunction = fn ?? null;
};

/**
 * Refreshes the token with mutex locking to prevent race conditions
 */
export const refreshTokenWithLock = async (): Promise<string | undefined> => {
  // If a refresh is already in progress, wait for it
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  // Start a new refresh
  tokenRefreshPromise = (async () => {
    try {
      if (!tokenRefreshFunction) {
        throw new Error("Token refresh function not initialized");
      }
      return await tokenRefreshFunction();
    } finally {
      // Clear the promise when done
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
};

/**
 * Creates a ky instance with proper auth handling and retry logic
 */
export const createKyInstance = (
  getTokenFn: () => Promise<string | undefined>,
  skipAuth = false,
): KyInstance => {
  return ky.create({
    prefix: apiURL.get(),
    retry: {
      limit: 2,
      methods: ["get", "put", "head", "delete", "options", "trace"],
      // Removed 413 (Payload Too Large) as retrying won't fix it
      statusCodes: [408, 429, 500, 502, 503, 504],
      // Don't retry 401 automatically - we handle it in hooks
    },
    hooks: {
      beforeRequest: [
        async ({ request }) => {
          if (!skipAuth) {
            const token = await getTokenFn();
            if (token) {
              request.headers.set("Authorization", `Bearer ${token}`);
            }
          }
        },
      ],
      afterResponse: [
        async ({ request, response }) => {
          // Handle 401 Unauthorized - attempt token refresh and retry
          if (response.status === 401 && !skipAuth) {
            try {
              // Refresh the token (with mutex lock)
              const newToken = await refreshTokenWithLock();

              if (newToken) {
                // Update the request with new token
                request.headers.set("Authorization", `Bearer ${newToken}`);
                // Retry the request with ky's built-in retry mechanism
                return ky(request);
              }
            } catch (error) {
              // If refresh fails, let the 401 propagate
              console.warn("Token refresh failed:", error);
            }
          }

          return response;
        },
      ],
    },
  });
};
