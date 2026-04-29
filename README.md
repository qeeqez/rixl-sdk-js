# RIXL JavaScript SDK

The official JavaScript and TypeScript client for the [RIXL](https://rixl.com) API.

[![npm](https://img.shields.io/npm/v/@rixl/js.svg)](https://www.npmjs.com/package/@rixl/js)
[![downloads](https://img.shields.io/npm/dm/@rixl/js.svg)](https://www.npmjs.com/package/@rixl/js)

[Installation](#installation) • [Quick start](#quick-start) • [Authentication](#authentication) • [Resources](#resources) • [Pagination](#pagination) • [Errors](#errors)

## Features

- Typed fluent API generated from the RIXL OpenAPI spec
- Written in TypeScript; types ship with the package
- Promise-based, works in Node.js and modern runtimes with `fetch`
- Pre-mapped error responses for 400, 401, 403, 404, and 500
- Pluggable `RequestAdapter` and authentication providers

## Requirements

- Node.js 18+
- A RIXL API key
- ESM-only — use `import`, not `require`

## Installation

```bash
npm install @rixl/js @microsoft/kiota-http-fetchlibrary
```

## Quick start

```ts
import { createRixlClient } from "@rixl/js";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";
import { ApiKeyAuthenticationProvider } from "@microsoft/kiota-abstractions";

const auth = new ApiKeyAuthenticationProvider(
    "YOUR_RIXL_API_KEY", "X-API-Key", "header",
);
const adapter = new FetchRequestAdapter(auth);
const client = createRixlClient(adapter);

const image = await client.images.byImageId("PS5IMKoFLm").get();
console.log(image?.id, image?.width, image?.height);
```

Base URL defaults to `https://api.rixl.com`. Override with `adapter.baseUrl = "..."`.

## Authentication

```ts
import {
    ApiKeyAuthenticationProvider,
    BaseBearerTokenAuthenticationProvider,
} from "@microsoft/kiota-abstractions";

// API key in a header
const auth = new ApiKeyAuthenticationProvider(
    "YOUR_RIXL_API_KEY", "X-API-Key", "header",
);

// Bearer token
// Implement AccessTokenProvider, then pass it to
// new BaseBearerTokenAuthenticationProvider(tokenProvider)
```

## Resources

### Feeds

```ts
const posts = await client.feeds.byFeedId("FD4y3QB38S").get();
for (const post of posts?.data ?? []) {
    console.log(post.id);
}
```

### Images

```ts
// List
const page = await client.images.get();

// Get
const image = await client.images.byImageId("PS5IMKoFLm").get();

// Delete
await client.images.byImageId("PS5IMKoFLm").delete();

// Upload (init → PUT bytes to presigned URL → complete)
const initRes = await client.images.upload.init.post({
    name: "photo.jpg",
    format: "jpeg",
});

await fetch(initRes.presignedUrl, {
    method: "PUT",
    body: imageBytes,
    headers: { "Content-Type": "image/jpeg" },
});

const image = await client.images.upload.complete.post({
    imageId: initRes.imageId,
    attachedToVideo: false,
});
```

### Videos

```ts
// List
const videos = await client.videos.get();

// Get
const video = await client.videos.byVideoId("VI9VXQxWXQ").get();

// Subtitle tracks
const tracks = await client.videos.byVideoId("VI9VXQxWXQ").subtitles.get();

// Upload (init returns presigned URLs for both the video and a poster image)
const initRes = await client.videos.upload.init.post({
    fileName: "clip.mp4",
    imageFormat: "jpeg",
});

// PUT video bytes to initRes.videoPresignedUrl
// PUT poster bytes to initRes.posterPresignedUrl

const video = await client.videos.upload.complete.post({
    videoId: initRes.videoId,
});
```

## Pagination

List endpoints accept `limit`, `offset`, `sort`, and `order`:

```ts
let offset = 0;
const limit = 50;

while (true) {
    const page = await client.images.get({
        queryParameters: { limit, offset, sort: "created_at", order: "desc" },
    });
    for (const img of page?.data ?? []) {
        // ...
    }
    const total = page?.pagination?.total ?? 0;
    offset += limit;
    if (offset >= total) break;
}
```

## Errors

API errors (400, 401, 403, 404, 500) are thrown as `ErrorResponse`:

```ts
import { ErrorResponse } from "@rixl/js";

try {
    const image = await client.images.byImageId("PS5IMKoFLm").get();
} catch (err) {
    if (err instanceof ErrorResponse) {
        console.error(`HTTP ${err.code}: ${err.errorEscaped}`);
    }
    throw err;
}
```

## Models

All types are re-exported from the package root:

| Type | Description |
|------|-------------|
| `Image`, `Video`, `Post`, `File` | Resource models |
| `Pagination` | Page metadata (`limit`, `offset`, `total`) |
| `PaginatedResponseImage`, `PaginatedResponseVideo`, `PaginatedResponsePost` | Paginated list wrappers |
| `UploadInitRequest`, `VideoUploadInitRequest` | Upload payloads |
| `ErrorResponse` | API error |

```ts
import type {
    Image, Video, Post, File,
    Pagination,
    PaginatedResponseImage, PaginatedResponseVideo, PaginatedResponsePost,
    UploadInitRequest, VideoUploadInitRequest,
    ErrorResponse,
} from "@rixl/js";
```

Fields are optional; use optional chaining (`image?.file?.url`).

## Examples

Self-contained demos live in [`examples/`](./examples). Each file imports the SDK and runs one task — copy any of them into your own project as a starting point.

| Path | What it shows | Script |
|---|---|---|
| `auth/` | both auth flows in one file — picks API key or client JWT from env | `npm run auth` |
| `basic/images/` | list images, fetch one by `IMAGE_ID` | `npm run basic:images` |
| `basic/videos/` | list videos, fetch one by `VIDEO_ID` | `npm run basic:videos` |
| `basic/feeds/` | read a feed — needs `RIXL_FEED_ID` | `npm run basic:feeds` |
| `basic/posts/` | read one post — needs `RIXL_FEED_ID` and `RIXL_POST_ID` | `npm run basic:posts` |
| `advanced/images/` | full image upload (init → PUT → complete) | `npm run advanced:images` |
| `advanced/videos/` | full video upload (video + poster) | `npm run advanced:videos` |

Credentials come from the RIXL dashboard (API key, or Client Auth → Create credential).

```bash
cd sdk && npm install && npm run build
cd ../examples && npm install

export RIXL_API_KEY=<copied from the dashboard>
export RIXL_BASE_URL=http://localhost:8081   # optional

npm run basic:images
npm run advanced:videos
npm run auth                                  # works with either credential type
```

## Support

Open an issue at [github.com/rixlhq/rixl-js](https://github.com/rixlhq/rixl-js/issues).
