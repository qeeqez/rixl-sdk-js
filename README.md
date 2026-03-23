# RIXL JavaScript SDK

The RIXL JavaScript SDK provides a robust, modular, and type-safe interface for the RIXL API. It is designed to be lightweight and easy to integrate into both browser and Node.js environments.

## Packages

The SDK is split into standalone service packages:

- **@rixl/sdk-js-feeds**: Interact with user and global feeds.
- **@rixl/sdk-js-videos**: Manage video content, uploads, and metadata.
- **@rixl/sdk-js-images**: Handle image assets and transformations.

## Installation

Install the SDK packages via npm or yarn:

```bash
npm install @rixl/sdk-js-feeds @rixl/sdk-js-videos @rixl/sdk-js-images
```

## Usage

Each service can be used independently:

```javascript
import { FeedsApi } from '@rixl/sdk-js-feeds';

const feeds = new FeedsApi();
// feeds.getFeed().then(...)
```

## Support

For technical support or issues, please visit our documentation or open a GitHub issue.
