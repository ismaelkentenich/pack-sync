import { DeliveryStatus, PackageStatus } from "./enums";
import { runSync, getFirstSync, getAllSync } from "./index";

export type Package = {
  id?: number;
  code: string;
  status: PackageStatus;
  deliveryStatus: DeliveryStatus;
  clientName?: string;
  scanned_at: string;
  sent_at?: string;
};

export function insertPackage(pkg: Package) {
  const safeCode = pkg.code.replace(/'/g, "''");
  const safeClient = pkg.clientName?.replace(/'/g, "''") ?? null;

  runSync(`
    INSERT INTO packages (code, status, deliveryStatus, clientName, scanned_at)
    VALUES ('${safeCode}', '${pkg.status}', '${pkg.deliveryStatus}', ${safeClient ? `'${safeClient}'` : "NULL"}, '${pkg.scanned_at}')
  `);
}

export function updatePackageStatus(id: number, status: PackageStatus, clientName?: string) {
  const safeClient = clientName?.replace(/'/g, "''") ?? null;
  runSync(`
    UPDATE packages 
    SET status='${status}', clientName=${safeClient ? `'${safeClient}'` : "NULL"} 
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

export function getAllPackages(): Package[] {
  return getAllSync<Package>("SELECT * FROM packages ORDER BY scanned_at DESC");
}
