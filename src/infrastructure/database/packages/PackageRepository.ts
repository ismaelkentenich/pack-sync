import { DeliveryStatus, PackageStatus } from "./enums";
import { packagesDb } from "./index";
import { Package } from "./packages";

export class PackageRepository {
  findByCode(code: string, userId: string): Package | null {
    const result = packagesDb.getFirstSync<Package>(
      `SELECT * FROM packages WHERE code = ? AND clientCode = ?`,
      [code, userId],
    );
    return result || null;
  }

  findAllByUser(userId: string): Package[] {
    return packagesDb.getAllSync<Package>(
      `SELECT * FROM packages WHERE clientCode = ? ORDER BY scanned_at DESC`,
      [userId],
    );
  }

  findByDeliveryStatus(userId: string, status: DeliveryStatus): Package[] {
    return packagesDb.getAllSync<Package>(
      `SELECT * FROM packages WHERE clientCode = ? AND deliveryStatus = ? ORDER BY scanned_at DESC`,
      [userId, status],
    );
  }

  create(pkg: Package): Package {
    packagesDb.runSync(
      `INSERT INTO packages (code, status, deliveryStatus, clientCode, scanned_at)
       VALUES (?, ?, ?, ?, ?)`,
      [pkg.code, pkg.status, pkg.deliveryStatus, pkg.clientCode ?? null, pkg.scanned_at],
    );

    const created = this.findByCode(pkg.code, pkg.clientCode!);
    if (!created) {
      throw new Error("Failed to create package");
    }
    return created;
  }

  updateStatus(
    id: number,
    status: PackageStatus,
    clientCode?: string,
    receiverName?: string,
  ): void {
    packagesDb.runSync(
      `UPDATE packages 
       SET status = ?, clientCode = ?, receiverName = ?
       WHERE id = ?`,
      [status, clientCode ?? null, receiverName ?? null, id],
    );
  }

  markAsSent(id: number): void {
    const now = new Date().toISOString();
    packagesDb.runSync(
      `UPDATE packages 
       SET deliveryStatus = ?, sent_at = ? 
       WHERE id = ?`,
      [DeliveryStatus.SENT, now, id],
    );
  }

  countByDeliveryStatus(userId: string, status: DeliveryStatus): number {
    const result = packagesDb.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count FROM packages WHERE clientCode = ? AND deliveryStatus = ?`,
      [userId, status],
    );
    return result?.count ?? 0;
  }

  delete(id: number): void {
    packagesDb.runSync(`DELETE FROM packages WHERE id = ?`, [id]);
  }

  batchUpdateStatus(packageIds: number[], status: PackageStatus, receiverName?: string): void {
    packagesDb.withTransactionSync(() => {
      packageIds.forEach((id) => {
        packagesDb.runSync(`UPDATE packages SET status = ?, receiverName = ? WHERE id = ?`, [
          status,
          receiverName ?? null,
          id,
        ]);
      });
    });
  }
}

export const packageRepository = new PackageRepository();
