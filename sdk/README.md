# RIXL JavaScript SDK

The official JavaScript and TypeScript client for the [RIXL](https://rixl.com) API.

[![npm](https://img.shields.io/npm/v/@rixl/js.svg)](https://www.npmjs.com/package/@rixl/js)

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
# Using npm
npm install @rixl/js @microsoft/kiota-http-fetchlibrary

# Using bun
bun add @rixl/js @microsoft/kiota-http-fetchlibrary
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
