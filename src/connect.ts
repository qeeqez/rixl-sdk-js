import {client} from "./generated/client.gen";
import {initClient} from "./auth/init";
import type {GoogleProviderConfig, AppleProviderConfig, MicrosoftProviderConfig, TelegramProviderConfig} from "./auth/providers";

export interface AuthConfig {
  loginRedirectUrl?: string;
  google?: GoogleProviderConfig;
  apple?: AppleProviderConfig;
  microsoft?: MicrosoftProviderConfig;
  telegram?: TelegramProviderConfig;
}

export interface ConnectConfig {
  baseUrl: string;
  apiKey?: string;
  auth?: AuthConfig;
}

export const connect = async (config: ConnectConfig): Promise<string | undefined> => {
  client.setConfig({baseUrl: config.baseUrl});

  if (config.apiKey) {
    client.interceptors.request.use(async (request) => {
      request.headers.set("X-API-Key", config.apiKey!);
      return request;
    });
  }

  if (config.auth) {
    return initClient({
      apiUrl: config.baseUrl,
      loginRedirectUrl: config.auth.loginRedirectUrl,
      googleProvider: config.auth.google,
      appleProvider: config.auth.apple,
      microsoftProvider: config.auth.microsoft,
      telegramProvider: config.auth.telegram,
    });
  }

  return undefined;
};
