import {
  DeliveryStatus,
  PackageStatus,
} from "./package.enums";
import { Package } from "./package.types";

export interface PackageRepository {
  findByCode(code: string, userId: string): Package | null;

  findAllByUser(userId: string): Package[];

  findByDeliveryStatus(
    userId: string,
    status: DeliveryStatus,
  ): Package[];

  create(pkg: Package): Package;

  updateStatus(
    id: number,
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): void;

  markAsSent(id: number, userId: string): void;

  countByDeliveryStatus(
    userId: string,
    status: DeliveryStatus,
  ): number;

  delete(id: number, userId: string): void;

  batchUpdateStatus(
    packageIds: number[],
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ): void;
}
