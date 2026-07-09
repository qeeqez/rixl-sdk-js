import {readFile} from "node:fs/promises";
import {basename, extname} from "node:path";

import {createClient, postImagesUploadComplete, postImagesUploadInit} from "@rixlhq/sdk";

import {optionalEnv, requiredEnv} from "./shared";

const client = createClient({
  auth: requiredEnv("RIXL_API_KEY"),
  baseUrl: optionalEnv("RIXL_BASE_URL") ?? "https://api.rixl.com/",
});

const filePath = requiredEnv("RIXL_IMAGE_FILE", "Set it to a path to an image file on disk.");
const format = optionalEnv("RIXL_IMAGE_FORMAT") ?? (extname(filePath).replace(/^\./, "").toLowerCase() || "png");

// 1. Ask the API for a presigned URL to upload to.
const init = await postImagesUploadInit({
  client,
  body: {
    name: basename(filePath),
    format,
  },
});

if (init.error) {
  console.error(`Upload init failed (${init.response?.status ?? "no response"}):`, init.error);
  process.exit(1);
}

const {image_id: imageId, presigned_url: presignedUrl} = init.data ?? {};

if (!imageId || !presignedUrl) {
  console.error("Upload init succeeded but did not return image_id and presigned_url.");
  process.exit(1);
}

console.log(`Init: image_id=${imageId}`);

// 2. Upload the bytes directly to the presigned URL with native fetch.
//    This step does not go through the SDK — the API hands you a URL to
//    PUT to, and you talk to object storage directly.
const fileBytes = await readFile(filePath);

const upload = await fetch(presignedUrl, {
  method: "PUT",
  body: fileBytes,
});

if (!upload.ok) {
  console.error(`Presigned PUT failed (${upload.status} ${upload.statusText}).`);
  process.exit(1);
}

console.log(`Uploaded ${fileBytes.byteLength} bytes to presigned URL.`);

// 3. Tell the API the upload finished so it can finalize the image record.
const complete = await postImagesUploadComplete({
  client,
  body: {image_id: imageId},
});

if (complete.error) {
  console.error(`Upload complete failed (${complete.response?.status ?? "no response"}):`, complete.error);
  process.exit(1);
}

console.log(`Image ${complete.data?.id} ready: ${complete.data?.width ?? "?"}x${complete.data?.height ?? "?"}.`);
