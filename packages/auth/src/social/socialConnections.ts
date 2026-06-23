import { getToken, login } from "../authStore";
import { initDeferred } from "../initialization";
import { setSocialConnectAttempt } from "./socialState";
import { authenticatedFetch } from "../api/fetchers";
import { handleApiError } from "../api/error-handlers";
import { HTTP_STATUS } from "../constants";
import { validateInput } from "../validation/base";
import { ConnectProviderSchema } from "../validation/auth";

export type ProviderType = "google" | "apple" | "microsoft" | "facebook" | "telegram";

// Provider type
export interface ConnectedProvider {
  provider: ProviderType;
  username?: string;
  first_name?: string;
  last_name?: string;
  email_address?: string;
  image_url?: string;
}

/**
 * Lists all available social providers and their connection status
 * @returns A promise that resolves to an array of providers
 */
export const listSocials = async (): Promise<ConnectedProvider[]> => {
  await initDeferred.promise;

  try {
    return await authenticatedFetch<ConnectedProvider[]>("providers", getToken, { method: "GET" });
  } catch (error) {
    return handleApiError(error, {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to list providers!"),
    });
  }
};

/**
 * Connects a new social provider
 * @returns A promise that resolves when the provider is connected
 */
export const connectSocialInternal = async (provider: string, token: string): Promise<void> => {
  await initDeferred.promise;

  try {
    const requestBody = validateInput(ConnectProviderSchema, { provider, token });
    await authenticatedFetch<void>("providers/connect", getToken, {
      method: "POST",
      body: requestBody,
    });
  } catch (error) {
    handleApiError(error, {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to connect provider!"),
    });
  }
};

/**
 * Disconnects a social provider
 * @param providerId The ID of the provider to disconnect
 * @returns A promise that resolves when the provider is disconnected
 */
export const disconnectSocial = async (providerId: string): Promise<void> => {
  await initDeferred.promise;

  try {
    await authenticatedFetch<void>(`providers/${providerId}`, getToken, { method: "DELETE" });
  } catch (error) {
    handleApiError(error, {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to disconnect provider!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Provider not found!"),
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Cannot disconnect the last social provider!"),
    });
  }
};

/**
 * Initiates a connection to a social provider by setting the connection attempt flag
 * and redirecting to the provider's authentication URL
 * @param provider The social provider to connect with
 */
export const connectSocial = (provider: ProviderType): void => {
  // Set the connection attempt flag
  setSocialConnectAttempt(provider);
  login(provider);
};
