# @rixl/sdk

Official TypeScript / JavaScript SDK for the [Rixl](https://rixl.com) REST API — typed client for managing images, videos, and feeds.

[![npm](https://img.shields.io/npm/v/@rixl/sdk.svg)](https://www.npmjs.com/package/@rixl/sdk)

## Install

```bash
npm install @rixl/sdk @microsoft/kiota-http-fetchlibrary
```

Requires Node.js 18+. ESM only — use `import`, not `require`.

## Quick start

```ts
import {createRixlClient} from "@rixl/sdk";
import {FetchRequestAdapter} from "@microsoft/kiota-http-fetchlibrary";
import {ApiKeyAuthenticationProvider} from "@microsoft/kiota-abstractions";

const auth = new ApiKeyAuthenticationProvider("YOUR_RIXL_API_KEY", "X-API-Key", "header");
const adapter = new FetchRequestAdapter(auth);
const client = createRixlClient(adapter);

const image = await client.images.byImageId("PS5IMKoFLm").get();
console.log(image?.id, image?.width, image?.height);
```

Default base URL: `https://api.rixl.com`. Override with `adapter.baseUrl = "..."`.

## Authentication

API key:

```ts
import {ApiKeyAuthenticationProvider} from "@microsoft/kiota-abstractions";

const auth = new ApiKeyAuthenticationProvider("YOUR_RIXL_API_KEY", "X-API-Key", "header");
```

Bearer token: implement `AccessTokenProvider`, pass to `new BaseBearerTokenAuthenticationProvider(tokenProvider)`.

## Feeds

```ts
const posts = await client.feeds.byFeedId("FD4y3QB38S").get();
for (const post of posts?.data ?? []) {
  console.log(post.id);
}
```

## Images

```ts
const page = await client.images.get();
const image = await client.images.byImageId("PS5IMKoFLm").get();
await client.images.byImageId("PS5IMKoFLm").delete();
```

Upload (init → PUT bytes → complete):

```ts
const initRes = await client.images.upload.init.post({
  name: "photo.jpg",
  format: "jpeg",
});

await fetch(initRes.presignedUrl, {
  method: "PUT",
  body: imageBytes,
  headers: {"Content-Type": "image/jpeg"},
});

const image = await client.images.upload.complete.post({
  imageId: initRes.imageId,
  attachedToVideo: false,
});
```

## Videos

```ts
const videos = await client.videos.get();
const video = await client.videos.byVideoId("VI9VXQxWXQ").get();
const tracks = await client.videos.byVideoId("VI9VXQxWXQ").subtitles.get();
```

Upload returns presigned URLs for both the video and a poster image:

```ts
const initRes = await client.videos.upload.init.post({
  fileName: "clip.mp4",
  imageFormat: "jpeg",
});
// PUT bytes to initRes.videoPresignedUrl and initRes.posterPresignedUrl

const video = await client.videos.upload.complete.post({
  videoId: initRes.videoId,
});
```

## Pagination

List endpoints take `limit`, `offset`, `sort`, `order`:

```ts
let offset = 0;
const limit = 50;

while (true) {
  const page = await client.images.get({
    queryParameters: {limit, offset, sort: "created_at", order: "desc"},
  });
  const total = page?.pagination?.total ?? 0;
  offset += limit;
  if (offset >= total) break;
}
```

## Errors

```ts
import {ErrorResponse} from "@rixl/sdk";

try {
  const image = await client.images.byImageId("PS5IMKoFLm").get();
} catch (err) {
  if (err instanceof ErrorResponse) {
    console.error(`HTTP ${err.code}: ${err.errorEscaped}`);
  }
  throw err;
}
```

## Examples

Runnable demos in [examples/](./examples):

```bash
cd examples && npm install
export RIXL_API_KEY=<key>
npm run basic:images
npm run advanced:videos
```

## Issues

[github.com/rixlhq/rixl-js/issues](https://github.com/rixlhq/rixl-js/issues)
