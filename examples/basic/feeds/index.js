// Read a feed and print the posts attached to it.
import {createRixlClient} from "@rixl/sdk-js";
import {FetchRequestAdapter} from "@microsoft/kiota-http-fetchlibrary";

class ApiKeyAuth {
  constructor(key) {
    this.key = key;
  }
  async authenticateRequest(request) {
    request.headers.add("X-API-Key", this.key);
  }
}

const apiKey = process.env.RIXL_API_KEY;
const feedId = process.env.RIXL_FEED_ID;
if (!apiKey || !feedId) {
  console.error("set RIXL_API_KEY and RIXL_FEED_ID");
  process.exit(1);
}
const baseURL = process.env.RIXL_BASE_URL ?? "http://localhost:8081";

const adapter = new FetchRequestAdapter(new ApiKeyAuth(apiKey));
adapter.baseUrl = baseURL;
const client = createRixlClient(adapter);

const page = await client.feeds.byFeedId(feedId).get();
const posts = page?.data ?? [];
console.log(`feed ${feedId} — ${posts.length} posts`);
for (const post of posts) console.log(`  - ${post.id}`);
