import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { PackageRow } from "@infrastructure/database/packages/types/package.row";
import type { Package } from "@features/packages/domain/package.types";

export class PackageMapper {
  static toDomain(row: PackageRow): Package {
    return {
      id: String(row.id),
      code: row.code,
      status: row.status as PackageStatus,
      deliveryStatus: row.deliveryStatus as DeliveryStatus,
      clientCode: row.clientCode,
      scanned_at: row.scanned_at,
      sent_at: row.sent_at ?? undefined,
      receiverName: row.receiverName ?? undefined,
      syncVersion: row.syncVersion ?? 1,
    };
  }
}

export const mapRowToPackage = PackageMapper.toDomain;
