import {
  createClient,
  deleteVideosByVideoIdSubtitles,
  deleteVideosByVideoIdSubtitlesBySubtitleId,
  deleteVideosByVideoIdSubtitlesLanguageByLangCode,
  getVideosLanguages,
  postVideosByVideoIdSubtitles,
  putVideosByVideoIdSubtitlesLanguageByLangCode,
} from "@rixl/sdk";

import {assertDestructiveEnabled, fileFromPath, optionalEnv, requiredEnv} from "./shared";

const client = createClient({
  auth: requiredEnv("RIXL_API_KEY"),
  baseUrl: optionalEnv("RIXL_BASE_URL") ?? "https://api.rixl.com/",
});

// 1. List supported subtitle languages. This endpoint is reusable across
//    accounts so it's a good first call to verify the chosen language code.
const langs = await getVideosLanguages({client});

if (langs.error) {
  console.error(`List languages failed (${langs.response?.status ?? "no response"}):`, langs.error);
  process.exit(1);
}

const supported = langs.data ?? [];
console.log(`API supports ${supported.length} subtitle languages.`);

const videoId = requiredEnv("RIXL_VIDEO_ID", "Set it to a video ID to attach subtitles to.");
const subtitleFilePath = requiredEnv("RIXL_SUBTITLE_FILE", "Set it to a path to a subtitle file (e.g. .vtt).");
const langCode = requiredEnv("RIXL_SUBTITLE_LANGUAGE_CODE", "Set it to a BCP 47 language code, e.g. en-US.");

if (supported.length > 0 && !supported.some((lang) => lang.code === langCode)) {
  console.warn(`Warning: ${langCode} is not in the supported language list — the upload may fail.`);
}

// 2. Bulk-add one or more subtitle files via multipart upload.
//    Same shape as bulk audio tracks — pass `files` as `File[]`.
//
//    Same temporary @ts-expect-error: upstream OpenAPI spec types the
//    multipart `files` field as Array<string>. Once the spec is fixed
//    and the SDK regenerated, this line will fail typecheck and should
//    be removed.
//    Tracking: rixlhq/api — bulk multipart `files` typed as Array<string>.
const subtitleFile = await fileFromPath(subtitleFilePath);

const created = await postVideosByVideoIdSubtitles({
  client,
  path: {videoId},
  body: {
    // @ts-expect-error spec types `files` as Array<string>; runtime accepts File[].
    files: [subtitleFile],
    language_codes: langCode,
    labels: `Subtitles (${langCode})`,
  },
});

if (created.error) {
  console.error(`Add subtitles failed (${created.response?.status ?? "no response"}):`, created.error);
  process.exit(1);
}

const subtitles = created.data ?? [];
console.log(`Added ${subtitles.length} subtitle track(s) to video ${videoId}.`);
for (const subtitle of subtitles) {
  console.log(`  - ${subtitle.id} ${subtitle.language_code ?? "?"} "${subtitle.label ?? ""}"`);
}

// 3. Replace the subtitle file for a language. Single-file body, field
//    name is `file` (singular), not `files`.
const replaced = await putVideosByVideoIdSubtitlesLanguageByLangCode({
  client,
  path: {videoId, lang_code: langCode},
  body: {
    file: subtitleFile,
    label: `Subtitles (${langCode}, replaced)`,
  },
});

if (replaced.error) {
  console.error(`Replace subtitle failed (${replaced.response?.status ?? "no response"}):`, replaced.error);
  process.exit(1);
}

console.log(`Replaced subtitle for ${langCode}: id=${replaced.data?.id}.`);

// 4. Destructive: delete a specific subtitle by ID.
const subtitleId = optionalEnv("RIXL_SUBTITLE_ID");

if (!subtitleId) {
  console.log("Skipping delete-by-id: set RIXL_SUBTITLE_ID to delete one specific subtitle.");
} else {
  assertDestructiveEnabled(`Deleting subtitle ${subtitleId}`);

  const deleted = await deleteVideosByVideoIdSubtitlesBySubtitleId({
    client,
    path: {videoId, subtitleId},
  });

  if (deleted.error) {
    console.error(`Delete subtitle failed (${deleted.response?.status ?? "no response"}):`, deleted.error);
    process.exit(1);
  }

  console.log(`Deleted subtitle ${subtitleId}.`);
}

// 5. Destructive: delete every subtitle for a given language, then all subtitles.
if (optionalEnv("RIXL_RUN_DESTRUCTIVE") !== "1") {
  console.log("Skipping delete-by-language and delete-all: set RIXL_RUN_DESTRUCTIVE=1 to run them.");
} else {
  assertDestructiveEnabled(`Deleting all ${langCode} subtitles on video ${videoId}`);

  const deletedLang = await deleteVideosByVideoIdSubtitlesLanguageByLangCode({
    client,
    path: {videoId, lang_code: langCode},
  });

  if (deletedLang.error) {
    console.error(`Delete by language failed (${deletedLang.response?.status ?? "no response"}):`, deletedLang.error);
    process.exit(1);
  }

  console.log(`Deleted all subtitles for ${langCode}.`);

  assertDestructiveEnabled(`Deleting all subtitles on video ${videoId}`);

  const deletedAll = await deleteVideosByVideoIdSubtitles({
    client,
    path: {videoId},
  });

  if (deletedAll.error) {
    console.error(`Delete all subtitles failed (${deletedAll.response?.status ?? "no response"}):`, deletedAll.error);
    process.exit(1);
  }

  console.log(`Deleted all subtitles on video ${videoId}.`);
}
