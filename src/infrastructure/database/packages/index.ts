import * as SQLite from "expo-sqlite";

export const packagesDb =
  SQLite.openDatabaseSync("packages.db");

export const runSync = (query: string): void => {
  packagesDb.execSync(query);
};

export const getFirstSync = <T>(
  query: string,
): T | null => {
  const result = packagesDb.getFirstSync(query);
  if (result === null || result === undefined) {
    return null;
  }
  return result as T;
};

export const getAllSync = <T>(query: string): T[] => {
  const result = packagesDb.getAllSync(query);
  if (!Array.isArray(result)) {
    return [];
  }
  return result as T[];
};
