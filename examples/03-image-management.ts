import {createClient, deleteImagesByImageId, getImages, getImagesByImageId} from "@rixlhq/sdk";

import {assertDestructiveEnabled, optionalEnv, requiredEnv} from "./shared";

const client = createClient({
  auth: requiredEnv("RIXL_API_KEY"),
  baseUrl: optionalEnv("RIXL_BASE_URL") ?? "https://api.rixl.com/",
});

// 1. List images, sorted newest-first.
const list = await getImages({
  client,
  query: {limit: 10, offset: 0, sort: "created_at", order: "desc"},
});

if (list.error) {
  console.error(`List images failed (${list.response?.status ?? "no response"}):`, list.error);
  process.exit(1);
}

const images = list.data?.data ?? [];
console.log(`Listed ${images.length} of ${list.data?.pagination?.total ?? "?"} images.`);
for (const image of images) {
  console.log(`  - ${image.id} (${image.width ?? "?"}x${image.height ?? "?"})`);
}

// 2. Fetch a single image by ID.
const imageId = requiredEnv("RIXL_IMAGE_ID", "Set it to an existing image ID.");

const detail = await getImagesByImageId({
  client,
  path: {imageId},
});

if (detail.error) {
  console.error(`Get image failed (${detail.response?.status ?? "no response"}):`, detail.error);
  process.exit(1);
}

console.log(
  `Image ${detail.data?.id}: ${detail.data?.width ?? "?"}x${detail.data?.height ?? "?"}, attached_to_video=${detail.data?.attached_to_video ?? false}`
);

// 3. Delete an image — only when explicitly opted in.
const deleteImageId = optionalEnv("RIXL_DELETE_IMAGE_ID");

if (!deleteImageId) {
  console.log("Skipping delete: set RIXL_DELETE_IMAGE_ID to run the destructive path.");
} else {
  assertDestructiveEnabled(`Deleting image ${deleteImageId}`);

  const deleted = await deleteImagesByImageId({
    client,
    path: {imageId: deleteImageId},
  });

  if (deleted.error) {
    console.error(`Delete image failed (${deleted.response?.status ?? "no response"}):`, deleted.error);
    process.exit(1);
  }

  console.log(`Deleted image ${deleteImageId} (status ${deleted.response?.status ?? "unknown"}).`);
}
