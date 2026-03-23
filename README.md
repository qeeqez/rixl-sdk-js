# RIXL JavaScript SDKs

This repository contains the JavaScript SDK split by service instead of one flat generated client.

## Layout

- `sdk/feeds` -> package `@rixl/sdk-js-feeds`
- `sdk/videos` -> package `@rixl/sdk-js-videos`
- `sdk/images` -> package `@rixl/sdk-js-images`

Each service folder is a standalone generated package with its own `package.json` and `src` directory.

## Build Example

Build the videos SDK:

```sh
cd sdk/videos
npm install
npm run build
```

## Regenerate

Generate all services:

```sh
./scripts/generate.sh
```

Generate one service:

```sh
./scripts/generate.sh --service videos
```

Regenerate from a fresh OpenAPI file:

```sh
./scripts/generate.sh --spec /path/to/public.swagger.json --service images
```
