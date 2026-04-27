# RIXL JavaScript SDK

The official JavaScript and TypeScript client for the [RIXL](https://rixl.com) API.

[![npm](https://img.shields.io/npm/v/@rixl/sdk-js.svg)](https://www.npmjs.com/package/@rixl/sdk-js)
[![downloads](https://img.shields.io/npm/dm/@rixl/sdk-js.svg)](https://www.npmjs.com/package/@rixl/sdk-js)

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
npm install @rixl/sdk-js @microsoft/kiota-http-fetchlibrary
```

## Quick start

```ts
import { createRixlClient } from "@rixl/sdk-js";
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
import { ErrorResponse } from "@rixl/sdk-js";

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
} from "@rixl/sdk-js";
```

Fields are optional; use optional chaining (`image?.file?.url`).

## Examples

Runnable demos live in [`examples/`](./examples):

- `basic/` — list images and fetch one by ID (uses `X-API-Key`).
- `advanced/` — full image and video upload pipelines (uses `X-API-Key`).
- `bearer/` — mint a short-lived client JWT via `POST /clientauth/token`, then call with `Authorization: Bearer …`. Use this pattern when the consumer can't safely hold a long-lived API key (browser, mobile).

```bash
cd sdk && npm install && npm run build
cd ../examples && npm install

export RIXL_BASE_URL=http://localhost:8081  # optional

# API key flows
export RIXL_API_KEY=<key>
npm run basic
npm run advanced

# Client JWT flow
# Mint your client_id and client_secret in the RIXL dashboard
# (Organization → Client Auth → Create credential), then:
export RIXL_CLIENT_ID=<copied from the dashboard>
export RIXL_CLIENT_SECRET=<copied from the dashboard>
export RIXL_PROJECT_ID=<project ID>
export RIXL_SUBJECT=user-42
npm run bearer
```

## Support

Open an issue at [github.com/qeeqez/rixl-sdk-js](https://github.com/qeeqez/rixl-sdk-js/issues).
