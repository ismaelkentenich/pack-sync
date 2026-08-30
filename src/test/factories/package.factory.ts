import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";

export function createPackage(
  overrides: Partial<Package> = {},
): Package {
  return {
    id: "1",
    code: "PKG-001",
    status: PackageStatus.COLLECTED,
    deliveryStatus: DeliveryStatus.PENDING,
    clientCode: "user-1",
    scanned_at: "2026-08-22T12:00:00.000Z",
    ...overrides,
  };
}
