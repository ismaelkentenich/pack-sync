import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { TFunction } from "i18next";

export function translatePackageStatus(
  status: PackageStatus,
  t: TFunction,
): string {
  switch (status) {
    case PackageStatus.COLETADO:
      return t("packages.status.collected");

    case PackageStatus.EM_ROTA_DE_ENTREGA:
      return t("packages.status.outForDelivery");

    case PackageStatus.ENTREGUE:
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
