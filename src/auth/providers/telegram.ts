import {atom, type WritableAtom} from "nanostores";
import {warnProviderNotConfigured} from "./oauth";

// Provider configuration interface
export interface TelegramProviderConfig {
  botId: string;
}

// Store provider configuration
export const telegramConfig: WritableAtom<TelegramProviderConfig | null> = atom<TelegramProviderConfig | null>(null);

// Store for Telegram auth URL
export const telegramAuthUrl: WritableAtom<string | null> = atom<string | null>(null);

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
