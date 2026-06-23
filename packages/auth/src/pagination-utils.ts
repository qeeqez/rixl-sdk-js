import { authenticatedFetch } from "./api/fetchers";
import { apiCall } from "./api/utils";
import { HTTP_STATUS } from "./constants";

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  limit: number;
  offset: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: PaginationMeta;
}

export interface FetchPaginatedOptions {
  endpoint: string;
  getTokenFunction: () => Promise<string | undefined>;
  paginationParams?: PaginationParams;
  unauthorizedMessage?: string;
}

const normalizeFetchPaginatedArgs = (
  args:
    | [FetchPaginatedOptions]
    | [string, () => Promise<string | undefined>, PaginationParams?, string?],
): FetchPaginatedOptions => {
  if (isLegacyFetchArgs(args)) {
    const [endpoint, getTokenFunction, paginationParams, unauthorizedMessage] = args;
    return {
      endpoint,
      getTokenFunction,
      paginationParams,
      unauthorizedMessage,
    };
  }

  return args[0];
};

const isLegacyFetchArgs = (
  args:
    | [FetchPaginatedOptions]
    | [string, () => Promise<string | undefined>, PaginationParams?, string?],
): args is [string, () => Promise<string | undefined>, PaginationParams?, string?] =>
  typeof args[0] === "string";

/**
 * Builds query string from pagination parameters
 * @param paginationParams - Optional pagination parameters (limit, offset)
 * @returns Query string with pagination parameters, or empty string
 */
export const buildPaginationQuery = (paginationParams?: PaginationParams): string => {
  if (!paginationParams) return "";

  const searchParams = new URLSearchParams();
  if (paginationParams.limit !== undefined) {
    searchParams.append("limit", paginationParams.limit.toString());
  }
  if (paginationParams.offset !== undefined) {
    searchParams.append("offset", paginationParams.offset.toString());
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * Generic fetch function for paginated API endpoints
 * @param endpoint - The API endpoint to fetch from
 * @param getTokenFunction - Function to retrieve the authentication token
 * @param paginationParams - Optional pagination parameters (limit, offset)
 * @param unauthorizedMessage - Custom error message for unauthorized access
 * @returns Promise resolving to the paginated data
 */
export const fetchPaginatedData = async <T>(
  ...args:
    | [FetchPaginatedOptions]
    | [string, () => Promise<string | undefined>, PaginationParams?, string?]
): Promise<T> => {
  const {
    endpoint,
    getTokenFunction,
    paginationParams,
    unauthorizedMessage = "User is not authorized!",
  } = normalizeFetchPaginatedArgs(args);

  return apiCall(
    async () => {
      const queryString = buildPaginationQuery(paginationParams);
      const fullEndpoint = `${endpoint}${queryString}`;
      const response = await authenticatedFetch<PaginatedResponse<T>>(
        fullEndpoint,
        getTokenFunction,
        { method: "GET" },
      );
      return response.data;
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error(unauthorizedMessage),
    },
  );
};
