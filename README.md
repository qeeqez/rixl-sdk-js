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

// Presigned upload
import type { UploadInitRequest } from "@rixl/sdk-js";

const req: UploadInitRequest = { name: "photo.jpg", format: "jpeg" };
const upload = await client.images.upload.init.post(req);
console.log(upload?.presignedUrl);
```

### Videos

```ts
// List
const videos = await client.videos.get();

// Get
const video = await client.videos.byVideoId("VI9VXQxWXQ").get();

// Subtitle tracks
const tracks = await client.videos.byVideoId("VI9VXQxWXQ").subtitles.get();
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

## Development

Regenerate from the OpenAPI spec (run from the monorepo root):

```bash
brew install kiota
bash sdk-manager/generate.sh rixl-sdk-js
```

Build the package:

```bash
cd sdk
npm install
npm run build
```

Generation uses `--clean-output`; do not hand-edit files under `sdk/src/`.

## Support

Open an issue at [github.com/qeeqez/rixl-sdk-js](https://github.com/qeeqez/rixl-sdk-js/issues).
