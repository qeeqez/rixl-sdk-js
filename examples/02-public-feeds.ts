import {createClient, Feeds} from "@rixl/sdk";

import {requiredEnv} from "./shared";

// Public feed endpoints don't require an API key, so we construct a client
// without `auth`. The same `createClient` factory still applies.
const client = createClient({});

const feedId = requiredEnv("RIXL_FEED_ID", "Set it to a feed ID to list posts from.");
const postId = requiredEnv("RIXL_POST_ID", "Set it to a post ID inside RIXL_FEED_ID.");
const creatorId = requiredEnv("RIXL_CREATOR_ID", "Set it to a creator ID inside RIXL_FEED_ID.");

const feed = await Feeds.list({
  client,
  path: {feedId},
  query: {limit: 5, offset: 0},
});

if (feed.error) {
  console.error(`Get feed failed (${feed.response?.status ?? "no response"}):`, feed.error);
  process.exit(1);
}

console.log(`Feed ${feedId}: ${feed.data?.data?.length ?? 0} posts (total ${feed.data?.pagination?.total ?? "?"}).`);

const post = await Feeds.get({
  client,
  path: {feedId, postId},
});

if (post.error) {
  console.error(`Get post failed (${post.response?.status ?? "no response"}):`, post.error);
  process.exit(1);
}

console.log(`Post ${postId}: type=${post.data?.type ?? "?"}, creator=${post.data?.creator_id ?? "?"}`);

const creatorFeed = await Feeds.listByCreator({
  client,
  path: {feedId, creatorId},
  query: {limit: 5, offset: 0},
});

if (creatorFeed.error) {
  console.error(`Get creator feed failed (${creatorFeed.response?.status ?? "no response"}):`, creatorFeed.error);
  process.exit(1);
}

console.log(`Creator ${creatorId} in feed ${feedId}: ${creatorFeed.data?.data?.length ?? 0} posts.`);
