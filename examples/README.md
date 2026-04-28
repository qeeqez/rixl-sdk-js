# Examples

Self-contained scripts. Each file imports the SDK and runs one task. ESM, Node.js 18+.

## Setup

```bash
cd ../sdk && npm install && npm run build
cd ../examples && npm install
```

## Run

```bash
export RIXL_API_KEY=<copied from the dashboard>
export RIXL_BASE_URL=http://localhost:8081   # optional, defaults to https://api.rixl.com

npm run auth              # show both auth flows in one file (API key or client JWT)
npm run basic:images      # list images, fetch by IMAGE_ID
npm run basic:videos      # list videos, fetch by VIDEO_ID
npm run basic:feeds       # read a feed (needs RIXL_FEED_ID)
npm run basic:posts       # fetch a post (needs RIXL_FEED_ID + RIXL_POST_ID)
npm run advanced:images   # full image upload pipeline
npm run advanced:videos   # full video upload pipeline
```
