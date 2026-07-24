import {
  authV1ProvidersServiceListProviders,
  authV1ProvidersServiceConnectProvider,
  authV1ProvidersServiceDisconnectProvider,
} from "../../generated/sdk.gen";
import type {AuthV1ExternalAccountProvider} from "../../generated/types.gen";
import {login} from "../authStore";
import {AuthProvider} from "../providers/types";
import {setSocialConnectAttempt} from "./socialState";
import {apiCall} from "../api/utils";
import {persistTokens} from "../api/tokens";
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

const PROVIDER_TO_PROTO: Record<ProviderType, AuthV1ExternalAccountProvider> = {
  google: "EXTERNAL_ACCOUNT_PROVIDER_GOOGLE",
  apple: "EXTERNAL_ACCOUNT_PROVIDER_APPLE",
  microsoft: "EXTERNAL_ACCOUNT_PROVIDER_MICROSOFT",
  facebook: "EXTERNAL_ACCOUNT_PROVIDER_FACEBOOK",
  telegram: "EXTERNAL_ACCOUNT_PROVIDER_TELEGRAM",
};

const PROVIDER_FROM_PROTO: Partial<Record<AuthV1ExternalAccountProvider, ProviderType>> = {
  EXTERNAL_ACCOUNT_PROVIDER_GOOGLE: "google",
  EXTERNAL_ACCOUNT_PROVIDER_APPLE: "apple",
  EXTERNAL_ACCOUNT_PROVIDER_MICROSOFT: "microsoft",
  EXTERNAL_ACCOUNT_PROVIDER_FACEBOOK: "facebook",
  EXTERNAL_ACCOUNT_PROVIDER_TELEGRAM: "telegram",
};

// The gateway serializes responses in snake_case with proto enum values, while
// the generated types model them in camelCase. Read the wire shape directly.
interface WireConnectedProvider {
  provider?: AuthV1ExternalAccountProvider;
  username?: string;
  first_name?: string;
  last_name?: string;
  email_address?: string;
  image_url?: string;
}

// Both Telegram login flavors connect the same external account.
const normalizeProviderType = (provider: string): ProviderType =>
  provider === AuthProvider.TELEGRAM_WEB || provider === AuthProvider.TELEGRAM_MINI_APP ? "telegram" : (provider as ProviderType);

const toProtoProvider = (provider: ProviderType): AuthV1ExternalAccountProvider => {
  const proto = PROVIDER_TO_PROTO[provider];
  if (!proto) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return proto;
};

export const listSocials = async (): Promise<ConnectedProvider[]> => {
  return apiCall(
    async () => {
      const {data} = await authV1ProvidersServiceListProviders({
        throwOnError: true,
      });
      const wireProviders = (data.providers ?? []) as WireConnectedProvider[];
      return wireProviders.flatMap((p) => {
        const provider = p.provider ? PROVIDER_FROM_PROTO[p.provider] : undefined;
        if (!provider) return [];
        return [
          {
            provider,
            username: p.username,
            first_name: p.first_name,
            last_name: p.last_name,
            email_address: p.email_address,
            image_url: p.image_url,
          },
        ];
      });
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to list providers!"),
    }
  );
};

export const connectSocialInternal = async (provider: string, token: string): Promise<void> => {
  return apiCall(
    async () => {
      const requestBody = validateInput(ConnectProviderSchema, {provider, token});
      const {data} = await authV1ProvidersServiceConnectProvider({
        body: {
          provider: toProtoProvider(normalizeProviderType(requestBody.provider)),
          token: requestBody.token,
        },
        throwOnError: true,
      });
      persistTokens(data);
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to connect provider!"),
    }
  );
};

export const disconnectSocial = async (provider: ProviderType): Promise<void> => {
  return apiCall(
    async () => {
      await authV1ProvidersServiceDisconnectProvider({
        path: {provider: toProtoProvider(provider)},
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
