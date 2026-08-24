import { TFunction } from "i18next";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";

export function translatePackageStatus(
  status: PackageStatus,
  t: TFunction,
): string {
  switch (status) {
    case PackageStatus.COLLECTED:
      return t("packages.status.collected");

    case PackageStatus.IN_DELIVERY:
      return t("packages.status.outForDelivery");

    case PackageStatus.DELIVERED:
      return t("packages.status.delivered");

    default:
      return status;
  }
}

export function translateDeliveryStatus(
  status: DeliveryStatus,
  t: TFunction,
): string {
  switch (status) {
    case DeliveryStatus.PENDING:
      return t("packages.deliveryStatus.pending");

    case DeliveryStatus.SENT:
      return t("packages.deliveryStatus.sent");

    default:
      return status;
  }
}
