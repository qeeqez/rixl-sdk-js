import {atom, type WritableAtom} from "nanostores";
import {warnProviderNotConfigured} from "./oauth";
import {shared} from "../../shared-runtime";

// Provider configuration interface
export interface TelegramProviderConfig {
  botId: string;
}

// Shared across copies of this package, for the reason given in oauth.ts.
export const telegramConfig: WritableAtom<TelegramProviderConfig | null> = shared("provider.telegram.config", () =>
  atom<TelegramProviderConfig | null>(null)
);

export const telegramAuthUrl: WritableAtom<string | null> = shared("provider.telegram.authUrl", () => atom<string | null>(null));

/**
 * Updates the Telegram authentication URL using the configured settings
 */
export function updateTelegramAuthUrl(): void {
  const config = telegramConfig.get();
  if (!config) {
    warnProviderNotConfigured("Telegram");
    telegramAuthUrl.set(null);
    return;
  }

  const url =
    "https://oauth.telegram.org/auth?" +
    `bot_id=${encodeURIComponent(config.botId)}` +
    `&origin=${encodeURIComponent(window.location.origin)}` +
    `&return_to=${encodeURIComponent(window.location.origin + location.pathname)}`;

  telegramAuthUrl.set(url);
}
