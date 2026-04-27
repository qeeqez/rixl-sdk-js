import { createRixlClient } from "@rixl/sdk-js";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";

import { ApiKeyHeaderAuth } from "../_shared/auth.js";
import { mustEnv } from "../_shared/env.js";

const SAMPLE_IMAGE = "https://picsum.photos/seed/rixl/800/600.jpg";
const SAMPLE_VIDEO = "https://download.samplelib.com/mp4/sample-5s.mp4";

async function fetchBytes(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`GET ${url}: ${resp.status} ${resp.statusText}`);
    return new Uint8Array(await resp.arrayBuffer());
}

async function putBytes(url, body, contentType) {
    const resp = await fetch(url, {
        method: "PUT",
        body,
        headers: { "Content-Type": contentType, "Content-Length": String(body.byteLength) },
    });
    if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`PUT ${url}: ${resp.status} ${resp.statusText}: ${text}`);
    }
}

async function uploadImage(client) {
    console.log("== Image upload ==");
    const body = await fetchBytes(SAMPLE_IMAGE);
    console.log(`downloaded ${body.byteLength} bytes`);

    const initRes = await client.images.upload.init.post({
        name: "sample.jpg",
        format: "jpeg",
    });
    console.log(`init: image_id=${initRes?.imageId}`);

    await putBytes(initRes.presignedUrl, body, "image/jpeg");
    console.log("uploaded bytes");

    const image = await client.images.upload.complete.post({
        imageId: initRes.imageId,
        attachedToVideo: false,
    });
    console.log(`complete: id=${image?.id} ${image?.width}x${image?.height}\n`);
}

async function uploadVideo(client) {
    console.log("== Video upload ==");
    const [video, poster] = await Promise.all([
        fetchBytes(SAMPLE_VIDEO),
        fetchBytes(SAMPLE_IMAGE),
    ]);
    console.log(`downloaded video=${video.byteLength} poster=${poster.byteLength}`);

    const initRes = await client.videos.upload.init.post({
        fileName: "sample.mp4",
        imageFormat: "jpeg",
    });
    console.log(`init: video_id=${initRes?.videoId} poster_id=${initRes?.posterId}`);

    await Promise.all([
        putBytes(initRes.videoPresignedUrl, video, "video/mp4"),
        putBytes(initRes.posterPresignedUrl, poster, "image/jpeg"),
    ]);
    console.log("uploaded video and poster");

    const finished = await client.videos.upload.complete.post({
        videoId: initRes.videoId,
    });
    console.log(`complete: id=${finished?.id}`);
}

const apiKey = mustEnv("RIXL_API_KEY");
const baseURL = process.env.RIXL_BASE_URL ?? "http://localhost:8081";

const adapter = new FetchRequestAdapter(new ApiKeyHeaderAuth(apiKey));
adapter.baseUrl = baseURL;
const client = createRixlClient(adapter);

await uploadImage(client);
await uploadVideo(client);
