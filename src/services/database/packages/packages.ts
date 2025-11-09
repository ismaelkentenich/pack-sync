import { DeliveryStatus, PackageStatus } from "./enums";
import { runSync, getFirstSync, getAllSync } from "./index";

export type Package = {
  id?: number;
  code: string;
  status: PackageStatus;
  deliveryStatus: DeliveryStatus;
  clientCode?: string;
  scanned_at: string;
  sent_at?: string;
  receiverName?: string;
};

export function insertPackage(pkg: Package) {
  const safeCode = pkg.code.replace(/'/g, "''");

  const existing = getFirstSync<Package>(`SELECT * FROM packages WHERE code='${safeCode}'`);
  if (!existing) {
    runSync(`
    INSERT INTO packages (code, status, deliveryStatus, clientCode, scanned_at)
    VALUES ('${pkg.code}', '${pkg.status}', '${pkg.deliveryStatus}', '${pkg.clientCode ?? "NULL"}', '${pkg.scanned_at}')
  `);
  }
  const inserted = getFirstSync<Package>(`SELECT * FROM packages WHERE code='${safeCode}'`);
  return inserted!;
}

export function updatePackageStatus(
  id: number,
  status: PackageStatus,
  clientCode?: string,
  receiverName?: string,
) {
  runSync(`
    UPDATE packages 
    SET status='${status}', clientCode='${clientCode}', receiverName='${receiverName ?? ""}'
    WHERE id=${id}
  `);
}

export function markPackageSent(id: number) {
  const now = new Date().toISOString();
  runSync(`
    UPDATE packages 
    SET deliveryStatus='${DeliveryStatus.SENT}', sent_at='${now}' 
    WHERE id=${id}
  `);
}

export function getAllPackages(clientCode: string): Package[] {
  return getAllSync<Package>(
    `SELECT * FROM packages WHERE clientCode = '${clientCode}' ORDER BY scanned_at DESC`,
  );
}
