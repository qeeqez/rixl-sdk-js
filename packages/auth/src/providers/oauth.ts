/**
 * Generic OAuth provider configuration and utilities
 * This file contains shared logic for all OAuth providers to reduce duplication
 */

import { atom, type WritableAtom } from "nanostores";
import { getOauthState } from "../state";
import { AuthProvider } from "./types";

/**
 * Base configuration for OAuth providers
 */
export interface OAuthProviderConfig {
  clientId: string;
  scope?: string;
}

/**
 * OAuth provider metadata
 */
export interface OAuthProviderMetadata {
  name: string;
  authBaseUrl: string;
  defaultScopes: string[];
  responseType: string;
  responseMode?: string;
  additionalParams?: Record<string, string>;
}

/**
 * Configuration for creating an OAuth provider
 */
export interface CreateOAuthProviderConfig {
  provider: AuthProvider;
  metadata: OAuthProviderMetadata;
}

/**
 * Result of creating an OAuth provider
 */
export interface OAuthProviderResult {
  config: WritableAtom<OAuthProviderConfig | null>;
  authUrl: WritableAtom<string | null>;
  updateAuthUrl: () => void;
}

/**
 * Builds an OAuth URL from configuration and metadata
 */
export const buildOAuthUrl = (
  config: OAuthProviderConfig,
  metadata: OAuthProviderMetadata,
  state: string,
): string => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: window.location.origin,
    response_type: metadata.responseType,
    scope: [...metadata.defaultScopes, ...(config.scope ? [config.scope] : [])].join(" "),
    state: state,
  });

  // Add nonce for providers that require it
  if (metadata.responseType.includes("id_token")) {
    params.set("nonce", state);
  }

  // Add response mode if specified
  if (metadata.responseMode) {
    params.set("response_mode", metadata.responseMode);
  }

  // Add any additional provider-specific params
  if (metadata.additionalParams) {
    Object.entries(metadata.additionalParams).forEach(([key, value]) => {
      params.set(key, value);
    });
  }

  return `${metadata.authBaseUrl}?${params.toString()}`;
};

/**
 * Warning helper for unconfigured providers
 */
export const warnProviderNotConfigured = (providerName: string): void => {
  console.warn(`${providerName} provider not configured. Check initClient method.`);
};

/**
 * Creates a reusable OAuth provider with configuration and URL management
 * This factory reduces code duplication across OAuth providers
 */
export const createOAuthProvider = ({
  provider,
  metadata,
}: CreateOAuthProviderConfig): OAuthProviderResult => {
  const config = atom<OAuthProviderConfig | null>(null);
  const authUrl = atom<string | null>(null);

  const updateAuthUrl = () => {
    const currentConfig = config.get();
    if (!currentConfig) {
      warnProviderNotConfigured(metadata.name);
      authUrl.set(null);
      return;
    }

    const state = getOauthState(provider);
    const url = buildOAuthUrl(currentConfig, metadata, state);
    authUrl.set(url);
  };

  return { config, authUrl, updateAuthUrl };
};
