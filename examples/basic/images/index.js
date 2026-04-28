// List images in your project, optionally fetch one by ID.
import { createRixlClient } from "@rixl/sdk-js";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";

class ApiKeyAuth {
    constructor(key) { this.key = key; }
    async authenticateRequest(request) {
        request.headers.add("X-API-Key", this.key);
    }
}

const apiKey = process.env.RIXL_API_KEY;
if (!apiKey) {
    console.error("missing RIXL_API_KEY");
    process.exit(1);
}
const baseURL = process.env.RIXL_BASE_URL ?? "http://localhost:8081";

const adapter = new FetchRequestAdapter(new ApiKeyAuth(apiKey));
adapter.baseUrl = baseURL;
const client = createRixlClient(adapter);

const page = await client.images.get();
const items = page?.data ?? [];
console.log(`listed ${items.length} images`);
for (const img of items) console.log(`  - ${img.id}`);

if (process.env.IMAGE_ID) {
    const img = await client.images.byImageId(process.env.IMAGE_ID).get();
    console.log(`image ${img?.id}: ${img?.width}x${img?.height}`);
}
