import {
  authV1ProvidersServiceListProviders,
  authV1ProvidersServiceConnectProvider,
  authV1ProvidersServiceDisconnectProvider,
} from "../../generated/sdk.gen";
import {login} from "../authStore";
import {setSocialConnectAttempt} from "./socialState";
import {apiCall} from "../api/utils";
import {setTokensFromWire} from "../api/wire-tokens";
import {HTTP_STATUS} from "../constants";
import {validateInput} from "../validation/base";
import {ConnectProviderSchema} from "../validation/auth";

export type ProviderType = "google" | "apple" | "microsoft" | "facebook" | "telegram";

export interface ConnectedProvider {
  provider: ProviderType;
  username?: string;
  first_name?: string;
  last_name?: string;
  email_address?: string;
  image_url?: string;
}

export const listSocials = async (): Promise<ConnectedProvider[]> => {
  return apiCall(
    async () => {
      const {data} = await authV1ProvidersServiceListProviders({
        throwOnError: true,
      });
      return (data.providers ?? []) as unknown as ConnectedProvider[];
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to list providers!"),
    }
  );
};

export const connectSocialInternal = async (provider: string, token: string): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(ConnectProviderSchema, {provider, token}) as {
        provider: "google" | "apple" | "microsoft" | "tgAuthResult";
        token: string;
      };
      const {data} = await authV1ProvidersServiceConnectProvider({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body: requestBody as any,
        throwOnError: true,
      });
      setTokensFromWire(data);
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to connect provider!"),
    }
  );
};

export const disconnectSocial = async (providerId: string): Promise<void> => {
  return apiCall(
    async () => {
      await authV1ProvidersServiceDisconnectProvider({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        path: {provider: providerId as any},
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to disconnect provider!"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Provider not found!"),
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Cannot disconnect the last social provider!"),
    }
  );
};

export const connectSocial = (provider: ProviderType): void => {
  setSocialConnectAttempt(provider);
  login(provider);
};
