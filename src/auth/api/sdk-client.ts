import {client} from "../../generated/client.gen";
import {apiURL} from "../api-url";
import {getToken} from "../authStore";

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
}
