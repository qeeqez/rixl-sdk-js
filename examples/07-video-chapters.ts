import {createClient, Videos} from "@rixl/sdk";

import {assertDestructiveEnabled, optionalEnv, requiredEnv} from "./shared";

const client = createClient({
  auth: requiredEnv("RIXL_API_KEY"),
});

const videoId = requiredEnv("RIXL_VIDEO_ID", "Set it to a video ID to manage chapters for.");

// 1. Replace the chapter list. The body shape (`UpdateChaptersRequest`)
//    is generated from the OpenAPI spec — `chapters` is an array of
//    `{ start_time_sec, title }` markers.
const updated = await Videos.updateChapters({
  client,
  path: {videoId},
  body: {
    chapters: [
      {start_time_sec: 0, title: "Intro"},
      {start_time_sec: 30, title: "Main content"},
      {start_time_sec: 120, title: "Outro"},
    ],
  },
});

if (updated.error) {
  console.error(`Update chapters failed (${updated.response?.status ?? "no response"}):`, updated.error);
  process.exit(1);
}

const chapters = updated.data?.chapters ?? [];
console.log(`Set ${chapters.length} chapters on video ${updated.data?.video_id}:`);
for (const chapter of chapters) {
  console.log(`  - [${chapter.start_time_sec ?? "?"}s] ${chapter.title ?? "(untitled)"}`);
}

// 2. Clear all chapters — destructive.
if (optionalEnv("RIXL_RUN_DESTRUCTIVE") !== "1") {
  console.log("Skipping clear: set RIXL_RUN_DESTRUCTIVE=1 to clear all chapters.");
} else {
  assertDestructiveEnabled(`Clearing chapters on video ${videoId}`);

  const cleared = await Videos.deleteChapters({
    client,
    path: {videoId},
  });

  if (cleared.error) {
    console.error(`Clear chapters failed (${cleared.response?.status ?? "no response"}):`, cleared.error);
    process.exit(1);
  }

  console.log(`Cleared chapters on video ${cleared.data?.video_id ?? videoId}.`);
}
