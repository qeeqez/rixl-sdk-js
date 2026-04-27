# Examples

Two runnable scripts against a local or remote RIXL API. ESM-only, Node.js 18+.

## Setup

```bash
cd ../sdk && npm install && npm run build
cd ../examples && npm install
```

The `@rixl/sdk-js` dependency is wired to `file:../sdk` for local development; when copying this example to a standalone project, replace it with a real version (e.g. `^0.1.0`).

## Run

```bash
export RIXL_API_KEY=<key>
export RIXL_BASE_URL=http://localhost:8081   # optional, defaults to https://api.rixl.com

npm run basic        # list images, fetch one by IMAGE_ID (X-API-Key)
npm run advanced     # full image and video upload pipelines (X-API-Key)
npm run bearer       # mint client JWT, then call with Bearer auth
```

The `bearer/` example needs `RIXL_CLIENT_ID`, `RIXL_CLIENT_SECRET`, `RIXL_PROJECT_ID`, and `RIXL_SUBJECT` instead of `RIXL_API_KEY`.
