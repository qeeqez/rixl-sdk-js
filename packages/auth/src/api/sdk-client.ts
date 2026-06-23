import { client } from "@rixl/sdk";
import { apiURL } from "../api-url";
import { getToken } from "../authStore";

let configured = false;

export function configureSdkClient(): void {
  if (configured) return;
  configured = true;

  client.setConfig({ baseUrl: apiURL.get() });

  apiURL.subscribe((url) => {
    client.setConfig({ baseUrl: url });
  });

  client.interceptors.request.use(async (request) => {
    const token = await getToken();
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  });
}
