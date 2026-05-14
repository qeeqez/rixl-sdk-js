import {createClient, Videos} from "@rixl/sdk";

import {assertDestructiveEnabled, fileFromPath, optionalEnv, requiredEnv} from "./shared";

const client = createClient({
  auth: requiredEnv("RIXL_API_KEY"),
});

// 1. List videos.
const list = await Videos.list({
  client,
  query: {limit: 10, offset: 0, sort: "created_at", order: "desc"},
});

if (list.error) {
  console.error(`List videos failed (${list.response?.status ?? "no response"}):`, list.error);
  process.exit(1);
}

const videos = list.data?.data ?? [];
console.log(`Listed ${videos.length} of ${list.data?.pagination?.total ?? "?"} videos.`);
for (const video of videos) {
  console.log(`  - ${video.id} (${video.width ?? "?"}x${video.height ?? "?"}, ${video.duration ?? "?"}s)`);
}

// 2. Fetch a single video by ID.
const videoId = requiredEnv("RIXL_VIDEO_ID", "Set it to an existing video ID.");

const detail = await Videos.get({
  client,
  path: {videoId},
});

if (detail.error) {
  console.error(`Get video failed (${detail.response?.status ?? "no response"}):`, detail.error);
  process.exit(1);
}

console.log(
  `Video ${detail.data?.id}: ${detail.data?.codec ?? "?"} @ ${detail.data?.framerate ?? "?"}fps, ${detail.data?.chapters?.length ?? 0} chapters.`
);

// 3. Replace the thumbnail with a multipart upload.
//    Hey API serializes the `body` object as multipart/form-data because
//    the generated type declares `thumbnail: Blob | File`.
const thumbnailFile = optionalEnv("RIXL_THUMBNAIL_FILE");

if (!thumbnailFile) {
  console.log("Skipping thumbnail update: set RIXL_THUMBNAIL_FILE to upload one.");
} else {
  const thumbnail = await fileFromPath(thumbnailFile);

  const updated = await Videos.updateThumbnail({
    client,
    path: {videoId},
    body: {thumbnail},
  });

  if (updated.error) {
    console.error(`Thumbnail update failed (${updated.response?.status ?? "no response"}):`, updated.error);
    process.exit(1);
  }

  console.log(`Thumbnail updated for video ${updated.data?.id}.`);
}

// 4. Delete the video — only when explicitly opted in.
const deleteVideoId = optionalEnv("RIXL_DELETE_VIDEO_ID");

if (!deleteVideoId) {
  console.log("Skipping delete: set RIXL_DELETE_VIDEO_ID to run the destructive path.");
} else {
  assertDestructiveEnabled(`Deleting video ${deleteVideoId}`);

  const deleted = await Videos.delete({
    client,
    path: {videoId: deleteVideoId},
  });

  if (deleted.error) {
    console.error(`Delete video failed (${deleted.response?.status ?? "no response"}):`, deleted.error);
    process.exit(1);
  }

  console.log(`Deleted video ${deleteVideoId} (status ${deleted.response?.status ?? "unknown"}).`);
}
