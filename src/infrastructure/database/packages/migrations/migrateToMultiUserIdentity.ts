import { packagesDb } from "../index";

type CountResult = {
  count: number;
};

function validateLegacyPackages(): void {
  const result = packagesDb.getFirstSync<CountResult>(`
      SELECT COUNT(*) AS count
      FROM packages
      WHERE clientCode IS NULL
         OR TRIM(CAST(clientCode AS TEXT)) = '';
    `);

  const invalidPackages = result?.count ?? 0;

  if (invalidPackages > 0) {
    throw new Error(
      `Não foi possível migrar o banco de pacotes: ${invalidPackages} pacote(s) não possuem clientCode.`,
    );
  }
}

export function migrateToMultiUserIdentity(): void {
  validateLegacyPackages();

  packagesDb.withTransactionSync(() => {
    packagesDb.execSync(`
      DROP TABLE IF EXISTS packages_v1;
    `);

    packagesDb.execSync(`
      CREATE TABLE packages_v1 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Coletado',
        deliveryStatus TEXT NOT NULL DEFAULT 'pending',
        clientCode TEXT NOT NULL,
        scanned_at TEXT NOT NULL,
        sent_at TEXT,
        receiverName TEXT,
        UNIQUE(code, clientCode)
      );
    `);

    packagesDb.execSync(`
      INSERT INTO packages_v1 (
        id,
        code,
        status,
        deliveryStatus,
        clientCode,
        scanned_at,
        sent_at,
        receiverName
      )
      SELECT
        id,
        code,
        status,
        deliveryStatus,
        CAST(clientCode AS TEXT),
        scanned_at,
        sent_at,
        receiverName
      FROM packages;
    `);

    packagesDb.execSync(`
      DROP TABLE packages;
    `);

    packagesDb.execSync(`
      ALTER TABLE packages_v1
      RENAME TO packages;
    `);

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

    packagesDb.execSync(`
      PRAGMA user_version = 1;
    `);
  });
}
