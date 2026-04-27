import { createRixlClient } from "@rixl/sdk-js";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";

import { ApiKeyHeaderAuth } from "../_shared/auth.js";
import { mustEnv } from "../_shared/env.js";

const apiKey = mustEnv("RIXL_API_KEY");
const baseURL = process.env.RIXL_BASE_URL ?? "http://localhost:8081";

const adapter = new FetchRequestAdapter(new ApiKeyHeaderAuth(apiKey));
adapter.baseUrl = baseURL;
const client = createRixlClient(adapter);

const page = await client.images.get();
const items = page?.data ?? [];
console.log(`Listed ${items.length} images`);
for (const img of items) {
    console.log(`  - ${img.id}`);
}

if (process.env.IMAGE_ID) {
    const image = await client.images.byImageId(process.env.IMAGE_ID).get();
    console.log(`Image ${image?.id}: ${image?.width}x${image?.height}`);
}
