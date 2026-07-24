import {client} from "../../generated/client.gen";
import {apiURL} from "../api-url";
import {getToken} from "../authStore";
import {ApiError} from "./types";

interface WireErrorBody {
  error?: string;
  details?: string;
  code?: number;
}

function isWireErrorBody(error: unknown): error is WireErrorBody {
  return typeof error === "object" && error !== null;
}

let configured = false;

export function configureSdkClient(): void {
  if (configured) return;
  configured = true;

  client.setConfig({baseUrl: apiURL.get()});

  apiURL.subscribe((url) => {
    client.setConfig({baseUrl: url});
  });

  client.interceptors.request.use(async (request) => {
    if (request.headers.has("Authorization")) {
      return request;
    }
    // The token endpoint authenticates via the refresh token in its body;
    // calling getToken() here would await the very refresh request being sent.
    if (new URL(request.url).pathname.endsWith("/auth/v1/token")) {
      return request;
    }
    const token = await getToken();
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  });

  // The generated client throws the parsed error body (a plain object or string),
  // which defeats every instanceof-based status mapping downstream. Wrap it into
  // an ApiError carrying the HTTP status so apiCall error maps and consumers can
  // handle errors by code.
  client.interceptors.error.use((error, response, request) => {
    if (error instanceof Error) {
      return error;
    }
    const body = isWireErrorBody(error) ? error : undefined;
    const status = response?.status ?? body?.code ?? 0;
    const message = body?.error || body?.details || (typeof error === "string" ? error : "Request failed");
    const endpoint = request ? new URL(request.url).pathname : "";
    return new ApiError(message, status, endpoint, error);
  });
}
