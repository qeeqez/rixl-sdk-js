import type {ApiRequestConfig} from "./types";

/**
 * Map to store in-flight GET requests for deduplication
 */
export const pendingRequests: Map<string, Promise<unknown>> = new Map<string, Promise<unknown>>();

/**
 * Generates a unique key for request deduplication
 */
export const getRequestKey = (endpoint: string, config: ApiRequestConfig): string => {
  // Only deduplicate GET requests
  if (config.method && config.method.toUpperCase() !== "GET") {
    return "";
  }
  return `${endpoint}|${JSON.stringify(config.headers)}|${JSON.stringify(config.body)}`;
};
