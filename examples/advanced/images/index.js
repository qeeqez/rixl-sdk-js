// Upload an image end-to-end:
//
//   1. Init     — tell the API you want to upload; it returns a presigned PUT URL.
//   2. PUT      — push the bytes straight to storage (the API never sees them).
//   3. Complete — tell the API the upload landed so it can finalize the record.
import {createRixlClient} from "@rixl/sdk-js";
import {FetchRequestAdapter} from "@microsoft/kiota-http-fetchlibrary";

const SAMPLE_IMAGE = "https://picsum.photos/seed/rixl/800/600.jpg";

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

const body = new Uint8Array(await (await fetch(SAMPLE_IMAGE)).arrayBuffer());
console.log(`downloaded ${body.byteLength} bytes`);

const init = await client.images.upload.init.post({name: "sample.jpg", format: "jpeg"});
console.log(`init: image_id=${init?.imageId}`);

const put = await fetch(init.presignedUrl, {
  method: "PUT",
  body,
  headers: {"Content-Type": "image/jpeg"},
});
if (!put.ok) throw new Error(`PUT ${put.status} ${await put.text()}`);

const img = await client.images.upload.complete.post({
  imageId: init.imageId,
  attachedToVideo: false,
});
console.log(`complete: id=${img?.id} ${img?.width}x${img?.height}`);
