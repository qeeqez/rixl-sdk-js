import {readFile} from "node:fs/promises";
import {basename, extname} from "node:path";

import type {GithubComRixlhqApiDbSqlcVideoQuality} from "@rixl/sdk";
import {createClient, Videos} from "@rixl/sdk";

import {optionalEnv, requiredEnv} from "./shared";

const VIDEO_QUALITIES = ["basic", "shorts", "pro"] as const satisfies ReadonlyArray<GithubComRixlhqApiDbSqlcVideoQuality>;

const client = createClient({
  auth: requiredEnv("RIXL_API_KEY"),
});

const videoFile = requiredEnv("RIXL_VIDEO_FILE", "Set it to a path to a local video file.");
const posterFile = requiredEnv("RIXL_POSTER_FILE", "Set it to a path to a local poster image.");

const rawQuality = optionalEnv("RIXL_VIDEO_QUALITY");
let quality: GithubComRixlhqApiDbSqlcVideoQuality | undefined;

if (rawQuality) {
  if (!(VIDEO_QUALITIES as ReadonlyArray<string>).includes(rawQuality)) {
    console.error(`RIXL_VIDEO_QUALITY must be one of: ${VIDEO_QUALITIES.join(", ")}.`);
    process.exit(1);
  }
  quality = rawQuality as GithubComRixlhqApiDbSqlcVideoQuality;
}

const posterFormat = extname(posterFile).replace(/^\./, "").toLowerCase() || undefined;

// 1. Ask the API for presigned URLs for both the video and its poster image.
const init = await Videos.uploadInit({
  client,
  body: {
    file_name: basename(videoFile),
    image_format: posterFormat,
    video_quality: quality,
  },
});

if (init.error) {
  console.error(`Video upload init failed (${init.response?.status ?? "no response"}):`, init.error);
  process.exit(1);
}

const {video_id: videoId, video_presigned_url: videoUrl, poster_presigned_url: posterUrl} = init.data ?? {};

if (!videoId || !videoUrl || !posterUrl) {
  console.error("Upload init succeeded but did not return video_id, video_presigned_url, and poster_presigned_url.");
  process.exit(1);
}

console.log(`Init: video_id=${videoId}`);

// 2. Upload both files in parallel with native fetch — these go to object
//    storage directly and do not pass through the SDK.
const [videoBytes, posterBytes] = await Promise.all([readFile(videoFile), readFile(posterFile)]);

const [videoUpload, posterUpload] = await Promise.all([
  fetch(videoUrl, {method: "PUT", body: videoBytes}),
  fetch(posterUrl, {method: "PUT", body: posterBytes}),
]);

if (!videoUpload.ok) {
  console.error(`Video PUT failed (${videoUpload.status} ${videoUpload.statusText}).`);
  process.exit(1);
}

if (!posterUpload.ok) {
  console.error(`Poster PUT failed (${posterUpload.status} ${posterUpload.statusText}).`);
  process.exit(1);
}

console.log(`Uploaded video (${videoBytes.byteLength} bytes) and poster (${posterBytes.byteLength} bytes).`);

// 3. Tell the API the upload finished so it can finalize the video record.
const complete = await Videos.uploadComplete({
  client,
  body: {video_id: videoId},
});

if (complete.error) {
  console.error(`Video upload complete failed (${complete.response?.status ?? "no response"}):`, complete.error);
  process.exit(1);
}

console.log(
  `Video ${complete.data?.id} ready: ${complete.data?.width ?? "?"}x${complete.data?.height ?? "?"}, ${complete.data?.duration ?? "?"}s.`
);
