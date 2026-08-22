import { migrateToMultiUserIdentity } from "./migrations/migrateToMultiUserIdentity";
import {
  createPackagesIndexes,
  createPackagesTable,
  PACKAGES_SCHEMA_VERSION,
} from "./schema";
import { packagesDb } from "./index";

type TableExistsResult = {
  name: string;
};

type UserVersionResult = {
  user_version: number;
};

function packagesTableExists(): boolean {
  const result = packagesDb.getFirstSync<TableExistsResult>(
    `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'packages'
        LIMIT 1;
      `,
  );

  return Boolean(result);
}

function getDatabaseVersion(): number {
  const result = packagesDb.getFirstSync<UserVersionResult>(
    "PRAGMA user_version;",
  );

  return result?.user_version ?? 0;
}

function setDatabaseVersion(version: number): void {
  packagesDb.execSync(`PRAGMA user_version = ${version};`);
}

function createCurrentSchema(): void {
  createPackagesTable();
  createPackagesIndexes();

  setDatabaseVersion(PACKAGES_SCHEMA_VERSION);
}

export function setupPackagesDatabase(): void {
  if (!packagesTableExists()) {
    createCurrentSchema();
    return;
  }

  const databaseVersion = getDatabaseVersion();

  if (databaseVersion < PACKAGES_SCHEMA_VERSION) {
    migrateToMultiUserIdentity();
  }

  createPackagesIndexes();

  const updatedVersion = getDatabaseVersion();

  if (updatedVersion > PACKAGES_SCHEMA_VERSION) {
    throw new Error(
      `Versão do banco não suportada. Atual: ${updatedVersion}. Suportada: ${PACKAGES_SCHEMA_VERSION}.`,
    );
  }
}
