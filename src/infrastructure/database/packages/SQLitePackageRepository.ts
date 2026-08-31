import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { PackageRepository } from "@features/packages/domain/package.repository";
import { Package } from "@features/packages/domain/package.types";
import { mapRowToPackage } from "@infrastructure/database/packages/mappers/package.mapper";
import { PackageRow } from "@infrastructure/database/packages/types/package.row";
import { packagesDb } from "./index";

export class SQLitePackageRepository implements PackageRepository {
  findById(id: string, userId: string): Package | null {
    const result = packagesDb.getFirstSync<PackageRow>(
      `
      SELECT *
      FROM packages
      WHERE id = ?
        AND clientCode = ?
    `,
      [id, userId],
    );

    return result ? mapRowToPackage(result) : null;
  }

  findByCode(code: string, userId: string): Package | null {
    const result = packagesDb.getFirstSync<PackageRow>(
      `
          SELECT *
          FROM packages
          WHERE code = ?
            AND clientCode = ?
        `,
      [code, userId],
    );

    return result ? mapRowToPackage(result) : null;
  }

  findAllByUser(userId: string): Package[] {
    const rows = packagesDb.getAllSync<PackageRow>(
      `
        SELECT *
        FROM packages
        WHERE clientCode = ?
        ORDER BY scanned_at DESC
      `,
      [userId],
    );

    return rows.map(mapRowToPackage);
  }

  findByDeliveryStatus(
    userId: string,
    status: DeliveryStatus,
  ): Package[] {
    const rows = packagesDb.getAllSync<PackageRow>(
      `
        SELECT *
        FROM packages
        WHERE clientCode = ?
          AND deliveryStatus = ?
        ORDER BY scanned_at DESC
      `,
      [userId, status],
    );

    return rows.map(mapRowToPackage);
  }

  create(pkg: Package): Package {
    packagesDb.runSync(
      `
      INSERT INTO packages (
        code,
        status,
        deliveryStatus,
        clientCode,
        scanned_at,
        syncVersion
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        pkg.code,
        pkg.status,
        pkg.deliveryStatus,
        pkg.clientCode,
        pkg.scanned_at,
        pkg.syncVersion ?? 1,
      ],
    );

    const created = this.findByCode(
      pkg.code,
      pkg.clientCode,
    );

    if (!created) {
      throw new Error("Failed to create package");
    }

    return created;
  }

  updateStatus(
    id: string,
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): void {
    packagesDb.runSync(
      `
        UPDATE packages
        SET status = ?,
            receiverName = ?,
            deliveryStatus = ?,
            sent_at = NULL,
            syncVersion = COALESCE(syncVersion, 1) + 1
        WHERE id = ?
          AND clientCode = ?
      `,
      [
        status,
        receiverName ?? null,
        DeliveryStatus.PENDING,
        id,
        userId,
      ],
    );
  }

  markAsSent(
    id: string,
    userId: string,
    syncVersion?: number,
  ): void {
    const sentAt = new Date().toISOString();

    if (syncVersion !== undefined) {
      packagesDb.runSync(
        `
          UPDATE packages
          SET deliveryStatus = ?,
              sent_at = ?
          WHERE id = ?
            AND clientCode = ?
            AND syncVersion = ?
        `,
        [
          DeliveryStatus.SENT,
          sentAt,
          id,
          userId,
          syncVersion,
        ],
      );
    } else {
      packagesDb.runSync(
        `
          UPDATE packages
          SET deliveryStatus = ?,
              sent_at = ?
          WHERE id = ?
            AND clientCode = ?
        `,
        [DeliveryStatus.SENT, sentAt, id, userId],
      );
    }
  }

  countByDeliveryStatus(
    userId: string,
    status: DeliveryStatus,
  ): number {
    const result = packagesDb.getFirstSync<{
      count: number;
    }>(
      `
          SELECT COUNT(*) AS count
          FROM packages
          WHERE clientCode = ?
            AND deliveryStatus = ?
        `,
      [userId, status],
    );

    return result?.count ?? 0;
  }

  delete(id: string, userId: string): void {
    packagesDb.runSync(
      `
        DELETE FROM packages
        WHERE id = ?
          AND clientCode = ?
      `,
      [id, userId],
    );
  }

  batchUpdateStatus(
    packageIds: string[],
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): void {
    if (packageIds.length === 0) {
      return;
    }

    packagesDb.withTransactionSync(() => {
      for (const id of packageIds) {
        packagesDb.runSync(
          `
            UPDATE packages
            SET status = ?,
                receiverName = ?,
                deliveryStatus = ?,
                sent_at = NULL,
                syncVersion = COALESCE(syncVersion, 1) + 1
            WHERE id = ?
              AND clientCode = ?
          `,
          [
            status,
            receiverName ?? null,
            DeliveryStatus.PENDING,
            id,
            userId,
          ],
        );
      }
    });
  }
}

export const sqlitePackageRepository =
  new SQLitePackageRepository();
