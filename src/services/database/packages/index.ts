import * as SQLite from "expo-sqlite";

export const packagesDb = SQLite.openDatabaseSync("packages.db");

export const runSync = (query: string): void => {
  packagesDb.execSync(query);
};

export const getFirstSync = <T>(query: string): T | null => {
  const result = packagesDb.getFirstSync(query);
  return result as T | null;
};

export const getAllSync = <T>(query: string): T[] => {
  const result = packagesDb.getAllSync(query);
  return result as T[];
};
