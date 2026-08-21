import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { packagesDb } from "./index";
import { Package } from "@features/packages/domain/package.types";

export function insertPackage(pkg: Package) {
  const existing = packagesDb.getFirstSync<Package>(
    `SELECT * FROM packages WHERE code = ?`,
    [pkg.code],
  );

  if (!existing) {
    packagesDb.runSync(
      `INSERT INTO packages (code, status, deliveryStatus, clientCode, scanned_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        pkg.code,
        pkg.status,
        pkg.deliveryStatus,
        pkg.clientCode ?? null,
        pkg.scanned_at,
      ],
    );
  }

  const inserted = packagesDb.getFirstSync<Package>(
    `SELECT * FROM packages WHERE code = ?`,
    [pkg.code],
  );
  return inserted!;
}

export function updatePackageStatus(
  id: number,
  status: PackageStatus,
  clientCode?: string,
  receiverName?: string,
) {
  packagesDb.runSync(
    `UPDATE packages
     SET status = ?, clientCode = ?, receiverName = ?
     WHERE id = ?`,
    [status, clientCode ?? null, receiverName ?? null, id],
  );
}

export function markPackageSent(id: number) {
  const now = new Date().toISOString();
  packagesDb.runSync(
    `UPDATE packages
     SET deliveryStatus = ?, sent_at = ?
     WHERE id = ?`,
    [DeliveryStatus.SENT, now, id],
  );
}

export function getAllPackages(
  clientCode: string,
): Package[] {
  return packagesDb.getAllSync<Package>(
    `SELECT * FROM packages WHERE clientCode = ? ORDER BY scanned_at DESC`,
    [clientCode],
  );
}
