import { HTTPError, type KyInstance, type Options } from "ky";
import { ApiError, ApiRequestConfig } from "./types";
import { getRequestKey, pendingRequests } from "./deduplication";

const normalizeEndpoint = (endpoint: string): string => endpoint.replace(/^\/+/, "");

/**
 * Helper to parse error response data
 */
const parseErrorData = async (error: HTTPError): Promise<unknown> => {
  try {
    return await error.response.json();
  } catch {
    return undefined;
  }
};

const buildRequestOptions = (config: ApiRequestConfig): Options => {
  const options: Options = {
    method: config.method?.toLowerCase() as Options["method"],
    headers: config.headers,
    signal: config.signal,
  };

  if (config.body) {
    options.json = typeof config.body === "string" ? JSON.parse(config.body) : config.body;
  }

  if (config.retry !== undefined) {
    options.retry = config.retry;
  }

  return options;
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const handleHttpError = async (error: HTTPError, endpoint: string): Promise<never> => {
  const errorData = await parseErrorData(error);
  const message =
    (errorData as { message?: string; error?: string } | undefined)?.message ||
    (errorData as { message?: string; error?: string } | undefined)?.error ||
    `Request failed with status ${error.response.status}`;
  throw new ApiError(message, { status: error.response.status, endpoint, data: errorData });
};

const executeRequest = async <T>(
  endpoint: string,
  config: ApiRequestConfig,
  getKyInstance: () => Promise<KyInstance>,
): Promise<T> => {
  const normalizedEndpoint = normalizeEndpoint(endpoint);

  try {
    const kyInstance = await getKyInstance();
    const options = buildRequestOptions(config);
    const response = await kyInstance(normalizedEndpoint, options);
    return await parseJsonResponse<T>(response);
  } catch (error) {
    if (error instanceof HTTPError) {
      await handleHttpError(error, endpoint);
    }
    throw error;
  }
};

/**
 * Base fetch function to handle common logic (deduplication, execution, error handling)
 */
export const baseFetch = async <T>(
  endpoint: string,
  config: ApiRequestConfig,
  getKyInstance: () => Promise<KyInstance>,
): Promise<T> => {
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  const requestKey = getRequestKey(normalizedEndpoint, config);

  if (requestKey && pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey) as Promise<T>;
  }

  const promise = executeRequest<T>(endpoint, config, getKyInstance).finally(() => {
    if (requestKey) {
      pendingRequests.delete(requestKey);
    }
  });

  if (requestKey) {
    pendingRequests.set(requestKey, promise);
  }

  return promise;
};
