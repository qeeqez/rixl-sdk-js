# @rixl/sdk

Official TypeScript / JavaScript SDK for the [Rixl](https://rixl.com) REST API.

Published on npm as [`@rixl/sdk`](https://www.npmjs.com/package/@rixl/sdk).

[![npm](https://img.shields.io/npm/v/@rixl/sdk.svg)](https://www.npmjs.com/package/@rixl/sdk)

## Install

| npm               | pnpm               | bun               | vite plus        |
| ----------------- | ------------------ | ----------------- | ---------------- |
| `npm i @rixl/sdk` | `pnpm i @rixl/sdk` | `bun i @rixl/sdk` | `vp i @rixl/sdk` |

Requires Node.js 18+. ESM only.

## Quick Start

```ts
import {createClient, getImages} from "@rixl/sdk";

const client = createClient({
  baseUrl: "https://api.rixl.com",
  auth: process.env.RIXL_API_KEY,
  responseStyle: "data",
});

const page = await getImages({
  client,
  query: {limit: 10},
});

console.log(page.data?.map((image) => image.id));
```

`auth` can be either a string or a function, so you can plug in API keys, bearer tokens, or runtime token refresh logic.

## Feed API

Fetch a feed and read posts:

```ts
import {createClient, getFeedsByFeedId} from "@rixl/sdk";

const client = createClient({
  baseUrl: "https://api.rixl.com",
  auth: process.env.RIXL_API_KEY,
  responseStyle: "data",
});

const feed = await getFeedsByFeedId({
  client,
  path: {feedId: "FD4y3QB38S"},
  query: {limit: 20, offset: 0},
});

for (const post of feed.data ?? []) {
  console.log(post.id, post.type);
}
```

## Image API

List images and fetch one by ID:

```ts
import {createClient, getImages, getImagesByImageId} from "@rixl/sdk";

const client = createClient({
  baseUrl: "https://api.rixl.com",
  auth: process.env.RIXL_API_KEY,
  responseStyle: "data",
});

const page = await getImages({
  client,
  query: {limit: 25, offset: 0},
});

const image = await getImagesByImageId({
  client,
  path: {imageId: "PS5IMKoFLm"},
});

console.log(page.data?.length, image.id, image.width, image.height);
```

Initialize an upload, PUT the bytes to storage, then complete the upload:

```ts
import {createClient, postImagesUploadComplete, postImagesUploadInit} from "@rixl/sdk";

const client = createClient({
  baseUrl: "https://api.rixl.com",
  auth: process.env.RIXL_API_KEY,
  responseStyle: "data",
});

const init = await postImagesUploadInit({
  client,
  body: {
    name: "photo.jpg",
    format: "jpeg",
  },
});

await fetch(init.presigned_url!, {
  method: "PUT",
  body: imageBytes,
  headers: {"Content-Type": "image/jpeg"},
});

const image = await postImagesUploadComplete({
  client,
  body: {
    image_id: init.image_id,
    attached_to_video: false,
  },
});

console.log(image.id);
```

## Video API

List videos and fetch one by ID:

```ts
import {createClient, getVideos, getVideosByVideoId} from "@rixl/sdk";

const client = createClient({
  baseUrl: "https://api.rixl.com",
  auth: process.env.RIXL_API_KEY,
  responseStyle: "data",
});

const page = await getVideos({
  client,
  query: {limit: 25, offset: 0},
});

const video = await getVideosByVideoId({
  client,
  path: {videoId: "VI9VXQxWXQ"},
});

console.log(page.data?.length, video.id, video.duration);
```

Video uploads follow the same pattern, but `init` returns both video and poster upload URLs:

```ts
import {createClient, postVideosUploadComplete, postVideosUploadInit} from "@rixl/sdk";

const client = createClient({
  baseUrl: "https://api.rixl.com",
  auth: process.env.RIXL_API_KEY,
  responseStyle: "data",
});

const init = await postVideosUploadInit({
  client,
  body: {
    file_name: "clip.mp4",
    image_format: "jpeg",
  },
});

await Promise.all([
  fetch(init.video_presigned_url!, {
    method: "PUT",
    body: videoBytes,
    headers: {"Content-Type": "video/mp4"},
  }),
  fetch(init.poster_presigned_url!, {
    method: "PUT",
    body: posterBytes,
    headers: {"Content-Type": "image/jpeg"},
  }),
]);

const video = await postVideosUploadComplete({
  client,
  body: {
    video_id: init.video_id,
  },
});

console.log(video.id);
```

## Development

This repository uses [Vite+](https://viteplus.dev/guide/) as the unified toolchain and package manager wrapper, with Bun underneath.

Install dependencies:

```bash
vp install
```

Regenerate config after dependency or config changes:

```bash
vp config
```

Build the library:

```bash
vp pack
```

Run formatting, linting, and type checks:

```bash
vp check
```

Run tests:

```bash
vp test
```

## Issues

[github.com/rixlhq/rixl-js/issues](https://github.com/rixlhq/rixl-js/issues)
