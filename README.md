# RIXL JavaScript SDK

The RIXL JavaScript SDK provides a typed, ergonomic client for the RIXL API.
The source is authored in TypeScript and compiled to JavaScript for publication
as `@rixl/sdk-js`.

The client is generated from the RIXL OpenAPI spec using
[Microsoft Kiota](https://learn.microsoft.com/openapi/kiota/).

## Installation

```bash
npm install @rixl/sdk-js
```

## Usage

```ts
import { RixlClient } from "@rixl/sdk-js";

// Provide a Kiota request adapter (e.g. from @microsoft/kiota-http-fetchlibrary).
const client = new RixlClient(requestAdapter);

const feed = await client.feeds.byFeedId("feed_123").get();
```

## Regenerating

The SDK is regenerated via `sdk-manager/generate.sh`:

```bash
bash ../sdk-manager/generate.sh rixl-sdk-js
```

## Support

Please report issues via the GitHub issue tracker.
