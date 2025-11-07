import * as SQLite from "expo-sqlite";

export const authDb = SQLite.openDatabaseSync("auth.db");

export const runSync = (query: string): void => {
  authDb.execSync(query);
};

export const getFirstSync = <T>(query: string): T | null => {
  const result = authDb.getFirstSync(query);
  return result as T | null;
};

export const getAllSync = <T>(query: string): T[] => {
  const result = authDb.getAllSync(query);
  return result as T[];
};
