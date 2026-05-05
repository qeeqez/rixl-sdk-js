// Upload a video end-to-end. Same shape as the image flow, but Init returns
// two presigned URLs (one for the video, one for the poster thumbnail) and
// we PUT to both.
import {createRixlClient} from "@rixl/sdk-js";
import {FetchRequestAdapter} from "@microsoft/kiota-http-fetchlibrary";

const SAMPLE_VIDEO = "https://download.samplelib.com/mp4/sample-5s.mp4";
const SAMPLE_POSTER = "https://picsum.photos/seed/rixl/800/600.jpg";

class ApiKeyAuth {
  constructor(key) {
    this.key = key;
  }
  async authenticateRequest(request) {
    request.headers.add("X-API-Key", this.key);
  }
}

const apiKey = process.env.RIXL_API_KEY;
if (!apiKey) {
  console.error("missing RIXL_API_KEY");
  process.exit(1);
}
const baseURL = process.env.RIXL_BASE_URL ?? "http://localhost:8081";

const adapter = new FetchRequestAdapter(new ApiKeyAuth(apiKey));
adapter.baseUrl = baseURL;
const client = createRixlClient(adapter);

async function fetchBytes(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`GET ${url}: ${resp.status}`);
  return new Uint8Array(await resp.arrayBuffer());
}

async function putBytes(url, body, contentType) {
  const resp = await fetch(url, {
    method: "PUT",
    body,
    headers: {"Content-Type": contentType},
  });
  if (!resp.ok) throw new Error(`PUT ${url}: ${resp.status} ${await resp.text()}`);
}

const [video, poster] = await Promise.all([fetchBytes(SAMPLE_VIDEO), fetchBytes(SAMPLE_POSTER)]);
console.log(`downloaded video=${video.byteLength} poster=${poster.byteLength}`);

const init = await client.videos.upload.init.post({fileName: "sample.mp4", imageFormat: "jpeg"});
console.log(`init: video_id=${init?.videoId} poster_id=${init?.posterId}`);

await Promise.all([putBytes(init.videoPresignedUrl, video, "video/mp4"), putBytes(init.posterPresignedUrl, poster, "image/jpeg")]);

const v = await client.videos.upload.complete.post({videoId: init.videoId});
console.log(`complete: id=${v?.id}`);
