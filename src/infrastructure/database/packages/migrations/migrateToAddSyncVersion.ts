import { packagesDb } from "../index";

export function migrateToAddSyncVersion(): void {
  packagesDb.withTransactionSync(() => {
    packagesDb.execSync(`
      ALTER TABLE packages
      ADD COLUMN syncVersion INTEGER NOT NULL DEFAULT 1;
    `);

    packagesDb.execSync(`
      PRAGMA user_version = 2;
    `);
  });
}
