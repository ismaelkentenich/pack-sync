import { DeliveryStatus, PackageStatus } from "./enums";
import { runSync, getFirstSync, getAllSync } from "./index";

export type Package = {
  id?: number;
  code: string;
  status: PackageStatus;
  deliveryStatus: DeliveryStatus;
  clientCode?: number;
  scanned_at: string;
  sent_at?: string;
};

export function insertPackage(pkg: Package) {
  const safeCode = pkg.code.replace(/'/g, "''");

  runSync(`
    INSERT INTO packages (code, status, deliveryStatus, clientCode, scanned_at)
    VALUES ('${safeCode}', '${pkg.status}', '${pkg.deliveryStatus}', ${pkg.clientCode ?? "NULL"}, '${pkg.scanned_at}')
  `);
}

export function updatePackageStatus(id: number, status: PackageStatus, clientCode?: number) {
  runSync(`
    UPDATE packages 
    SET status='${status}', clientCode=${clientCode ?? "NULL"}
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

export function getAllPackages(clientCode: number): Package[] {
  return getAllSync<Package>(
    `SELECT * FROM packages WHERE clientCode = ${clientCode} ORDER BY scanned_at DESC`,
  );
}
