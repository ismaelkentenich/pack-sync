import {
  FIREBASE_API_KEY as RAW_FIREBASE_API_KEY,
  FIREBASE_APP_ID as RAW_FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN as RAW_FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID as RAW_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID as RAW_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET as RAW_FIREBASE_STORAGE_BUCKET,
  PACKAGE_SYNC_URL as RAW_PACKAGE_SYNC_URL,
} from "@env";

export function requiredEnv(
  name: string,
  value: string | undefined,
): string {
  if (!value?.trim()) {
    throw new Error(
      `Missing required environment variable: ${name}`,
    );
  }

  return value.trim();
}

export const ENV = {
  PACKAGE_SYNC_URL: requiredEnv(
    "PACKAGE_SYNC_URL",
    RAW_PACKAGE_SYNC_URL,
  ),
  FIREBASE_API_KEY: requiredEnv(
    "FIREBASE_API_KEY",
    RAW_FIREBASE_API_KEY,
  ),
  FIREBASE_AUTH_DOMAIN: requiredEnv(
    "FIREBASE_AUTH_DOMAIN",
    RAW_FIREBASE_AUTH_DOMAIN,
  ),
  FIREBASE_PROJECT_ID: requiredEnv(
    "FIREBASE_PROJECT_ID",
    RAW_FIREBASE_PROJECT_ID,
  ),
  FIREBASE_STORAGE_BUCKET: requiredEnv(
    "FIREBASE_STORAGE_BUCKET",
    RAW_FIREBASE_STORAGE_BUCKET,
  ),
  FIREBASE_MESSAGING_SENDER_ID: requiredEnv(
    "FIREBASE_MESSAGING_SENDER_ID",
    RAW_FIREBASE_MESSAGING_SENDER_ID,
  ),
  FIREBASE_APP_ID: requiredEnv(
    "FIREBASE_APP_ID",
    RAW_FIREBASE_APP_ID,
  ),
} as const;

export type AppEnv = typeof ENV;
