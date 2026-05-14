import {createClient, Images} from "@rixl/sdk";

import {requiredEnv} from "./shared";

const client = createClient({
  auth: requiredEnv("RIXL_API_KEY", "Set it to a Rixl API key before running this example."),
});

const {data, error, response} = await Images.list({
  client,
  query: {limit: 1, offset: 0},
});

if (error) {
  console.error(`List images failed (${response?.status ?? "no response"}):`, error);
  process.exit(1);
}

console.log("Connected to the Rixl API.");
console.log(`HTTP status: ${response?.status ?? "unknown"}`);
console.log(`Images returned: ${data?.data?.length ?? 0}`);
console.log(`Total images available: ${data?.pagination?.total ?? "unknown"}`);
