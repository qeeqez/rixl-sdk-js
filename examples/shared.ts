import {readFile} from "node:fs/promises";
import {basename} from "node:path";

export function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value?.trim() ? value : undefined;
}

export function requiredEnv(name: string, hint?: string): string {
  const value = optionalEnv(name);

  if (!value) {
    const suffix = hint ? ` ${hint}` : "";
    throw new Error(`Missing ${name}.${suffix}`);
  }

  return value;
}

export async function fileFromPath(filePath: string, type?: string): Promise<File> {
  const buffer = await readFile(filePath);
  const bytes = new Uint8Array(buffer.byteLength);
  bytes.set(buffer);

  return new File([bytes], basename(filePath), type ? {type} : undefined);
}

export function assertDestructiveEnabled(action: string): void {
  if (optionalEnv("RIXL_RUN_DESTRUCTIVE") !== "1") {
    throw new Error(`${action} is destructive. Set RIXL_RUN_DESTRUCTIVE=1 to run it intentionally.`);
  }
}
