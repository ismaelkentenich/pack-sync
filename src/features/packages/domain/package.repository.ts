import {
  DeliveryStatus,
  PackageStatus,
} from "./package.enums";
import { Package } from "./package.types";

export interface PackageRepository {
  findById(id: string, userId: string): Package | null;

  findByCode(code: string, userId: string): Package | null;

  findAllByUser(userId: string): Package[];

  findByDeliveryStatus(
    userId: string,
    status: DeliveryStatus,
  ): Package[];

  create(pkg: Package): Package;

  updateStatus(
    id: string,
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): void;

  markAsSent(
    id: string,
    userId: string,
    syncVersion?: number,
  ): void;

  countByDeliveryStatus(
    userId: string,
    status: DeliveryStatus,
  ): number;

  delete(id: string, userId: string): void;

  batchUpdateStatus(
    packageIds: string[],
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): void;
}
