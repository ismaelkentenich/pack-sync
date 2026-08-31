import { packagesDb } from "./index";

export const PACKAGES_SCHEMA_VERSION = 2;

export function createPackagesTable(): void {
  packagesDb.execSync(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Coletado',
      deliveryStatus TEXT NOT NULL DEFAULT 'pending',
      clientCode TEXT NOT NULL,
      scanned_at TEXT NOT NULL,
      sent_at TEXT,
      receiverName TEXT,
      syncVersion INTEGER NOT NULL DEFAULT 1,
      UNIQUE(code, clientCode)
    );
  `);
}

export function createPackagesIndexes(): void {
  packagesDb.execSync(`
    CREATE INDEX IF NOT EXISTS
      idx_packages_client_code
    ON packages(clientCode);
  `);

  packagesDb.execSync(`
    CREATE INDEX IF NOT EXISTS
      idx_packages_client_delivery_status
    ON packages(clientCode, deliveryStatus);
  `);
}
