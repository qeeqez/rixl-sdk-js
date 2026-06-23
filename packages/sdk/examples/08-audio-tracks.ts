import {
  createClient,
  deleteVideosByVideoIdAudioTracks,
  deleteVideosByVideoIdAudioTracksByTrackId,
  deleteVideosByVideoIdAudioTracksLanguageByLangCode,
  postVideosByVideoIdAudioTracks,
  putVideosByVideoIdAudioTracksLanguageByLangCode,
} from "@rixl/sdk";

import {assertDestructiveEnabled, fileFromPath, optionalEnv, requiredEnv} from "./shared";

const client = createClient({
  auth: requiredEnv("RIXL_API_KEY"),
  baseUrl: optionalEnv("RIXL_BASE_URL") ?? "https://api.rixl.com/",
});

const videoId = requiredEnv("RIXL_VIDEO_ID", "Set it to a video ID to attach audio tracks to.");
const audioFilePath = requiredEnv("RIXL_AUDIO_FILE", "Set it to a path to an audio file on disk.");
const langCode = requiredEnv("RIXL_AUDIO_LANGUAGE_CODE", "Set it to a BCP 47 language code, e.g. en-US.");

// 1. Bulk-add one or more audio tracks via multipart upload.
//    Pass `files` as `File[]` — that is what the server accepts and what
//    the SDK serializes correctly at runtime.
//
//    The @ts-expect-error below is temporary. The upstream OpenAPI spec
//    incorrectly types the multipart `files` field as Array<string>, so
//    the SDK inherits that typing. Once the spec is fixed and the SDK
//    is regenerated, this line will fail typecheck (no error to
//    suppress) — that is the signal to remove it.
//    Tracking: rixlhq/api — bulk multipart `files` typed as Array<string>.
const audioFile = await fileFromPath(audioFilePath);

const created = await postVideosByVideoIdAudioTracks({
  client,
  path: {videoId},
  body: {
    // @ts-expect-error spec types `files` as Array<string>; runtime accepts File[].
    files: [audioFile],
    language_codes: langCode,
    labels: `Audio (${langCode})`,
  },
});

if (created.error) {
  console.error(`Add audio tracks failed (${created.response?.status ?? "no response"}):`, created.error);
  process.exit(1);
}

const tracks = created.data ?? [];
console.log(`Added ${tracks.length} audio track(s) to video ${videoId}.`);
for (const track of tracks) {
  console.log(`  - ${track.id} ${track.language_code ?? "?"} "${track.label ?? ""}"`);
}

// 2. Replace an existing audio track for a language. This endpoint takes
//    a single file in the body — note the field name is `file`, not `files`.
const replaced = await putVideosByVideoIdAudioTracksLanguageByLangCode({
  client,
  path: {videoId, lang_code: langCode},
  body: {
    file: audioFile,
    label: `Audio (${langCode}, replaced)`,
  },
});

if (replaced.error) {
  console.error(`Replace audio track failed (${replaced.response?.status ?? "no response"}):`, replaced.error);
  process.exit(1);
}

console.log(`Replaced audio track for ${langCode}: id=${replaced.data?.id}.`);

// 3. Destructive: delete a specific track by ID.
const trackId = optionalEnv("RIXL_AUDIO_TRACK_ID");

if (!trackId) {
  console.log("Skipping delete-by-id: set RIXL_AUDIO_TRACK_ID to delete one specific track.");
} else {
  assertDestructiveEnabled(`Deleting audio track ${trackId}`);

  const deleted = await deleteVideosByVideoIdAudioTracksByTrackId({
    client,
    path: {videoId, trackId},
  });

  if (deleted.error) {
    console.error(`Delete track failed (${deleted.response?.status ?? "no response"}):`, deleted.error);
    process.exit(1);
  }

  console.log(`Deleted audio track ${trackId}.`);
}

// 4. Destructive: delete every track for a given language.
if (optionalEnv("RIXL_RUN_DESTRUCTIVE") !== "1") {
  console.log("Skipping delete-by-language: set RIXL_RUN_DESTRUCTIVE=1 to delete tracks by language.");
} else {
  assertDestructiveEnabled(`Deleting all ${langCode} audio tracks on video ${videoId}`);

  const deletedLang = await deleteVideosByVideoIdAudioTracksLanguageByLangCode({
    client,
    path: {videoId, lang_code: langCode},
  });

  if (deletedLang.error) {
    console.error(`Delete by language failed (${deletedLang.response?.status ?? "no response"}):`, deletedLang.error);
    process.exit(1);
  }

  console.log(`Deleted all audio tracks for ${langCode}.`);

  // 5. Destructive: delete every audio track on the video.
  assertDestructiveEnabled(`Deleting all audio tracks on video ${videoId}`);

  const deletedAll = await deleteVideosByVideoIdAudioTracks({
    client,
    path: {videoId},
  });

  if (deletedAll.error) {
    console.error(`Delete all audio tracks failed (${deletedAll.response?.status ?? "no response"}):`, deletedAll.error);
    process.exit(1);
  }

  console.log(`Deleted all audio tracks on video ${videoId}.`);
}
