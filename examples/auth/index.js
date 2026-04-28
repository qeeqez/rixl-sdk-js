// One file showing both auth flows. Pick one by setting env vars:
//
//   - API key:    RIXL_API_KEY=...
//   - Client JWT: RIXL_CLIENT_ID=..., RIXL_CLIENT_SECRET=..., RIXL_PROJECT_ID=..., RIXL_SUBJECT=...
//
// Copy the credentials from the RIXL dashboard.
import { createRixlClient } from "@rixl/sdk-js";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";

// Sends a fixed header on every request. Swap in for Kiota's stock providers,
// which reject non-HTTPS URLs (so localhost dev fails).
class HeaderAuth {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    async authenticateRequest(request) {
        request.headers.add(this.name, this.value);
    }
}

async function mintToken(baseURL, payload) {
    const resp = await fetch(`${baseURL}/clientauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error(`mint token: ${resp.status} ${await resp.text()}`);
    const { access_token } = await resp.json();
    return access_token;
}

async function pickAuth(baseURL) {
    if (process.env.RIXL_API_KEY) {
        console.log("auth: API key");
        return new HeaderAuth("X-API-Key", process.env.RIXL_API_KEY);
    }
    const { RIXL_CLIENT_ID, RIXL_CLIENT_SECRET, RIXL_PROJECT_ID, RIXL_SUBJECT } = process.env;
    if (!RIXL_CLIENT_ID || !RIXL_CLIENT_SECRET) {
        console.error("set RIXL_API_KEY, or RIXL_CLIENT_ID + RIXL_CLIENT_SECRET + RIXL_PROJECT_ID + RIXL_SUBJECT");
        process.exit(1);
    }
    console.log("auth: client JWT");
    const token = await mintToken(baseURL, {
        client_id: RIXL_CLIENT_ID,
        client_secret: RIXL_CLIENT_SECRET,
        subject: RIXL_SUBJECT,
        project_id: RIXL_PROJECT_ID,
    });
    return new HeaderAuth("Authorization", `Bearer ${token}`);
}

const baseURL = process.env.RIXL_BASE_URL ?? "http://localhost:8081";
const adapter = new FetchRequestAdapter(await pickAuth(baseURL));
adapter.baseUrl = baseURL;
const client = createRixlClient(adapter);

const page = await client.images.get();
console.log(`auth ok — listed ${page?.data?.length ?? 0} images`);
