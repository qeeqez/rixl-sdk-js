import { createRixlClient } from "@rixl/sdk-js";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";

import { BearerAuth } from "../_shared/auth.js";
import { mustEnv } from "../_shared/env.js";

async function mintToken(baseURL, payload) {
    const resp = await fetch(`${baseURL}/clientauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`mint token: ${resp.status} ${resp.statusText}: ${text}`);
    }
    return resp.json();
}

const baseURL = process.env.RIXL_BASE_URL ?? "http://localhost:8081";
const payload = {
    client_id: mustEnv("RIXL_CLIENT_ID"),
    client_secret: mustEnv("RIXL_CLIENT_SECRET"),
    subject: mustEnv("RIXL_SUBJECT"),
    project_id: mustEnv("RIXL_PROJECT_ID"),
};

const tok = await mintToken(baseURL, payload);
console.log(`minted token (expires_in=${tok.expires_in}s, type=${tok.token_type})`);

const adapter = new FetchRequestAdapter(new BearerAuth(tok.access_token));
adapter.baseUrl = baseURL;
const client = createRixlClient(adapter);

const page = await client.images.get();
console.log(`Listed ${page?.data?.length ?? 0} images`);
