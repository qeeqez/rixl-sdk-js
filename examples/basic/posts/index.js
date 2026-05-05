// Fetch a single post inside a feed. Posts always live under a feed —
// there's no top-level posts collection.
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
const postId = process.env.RIXL_POST_ID;
if (!apiKey || !feedId || !postId) {
  console.error("set RIXL_API_KEY, RIXL_FEED_ID, and RIXL_POST_ID");
  process.exit(1);
}
const baseURL = process.env.RIXL_BASE_URL ?? "http://localhost:8081";

const adapter = new FetchRequestAdapter(new ApiKeyAuth(apiKey));
adapter.baseUrl = baseURL;
const client = createRixlClient(adapter);

const post = await client.feeds.byFeedId(feedId).byPostId(postId).get();
console.log(`post ${post?.id}`);
