import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import type { Package } from "@features/packages/domain/package.types";

type BuildUpdatedPackageParams = {
  packageData: Package;
  status: PackageStatus;
  receiverName?: string;
};

export function buildUpdatedPackage({
  packageData,
  status,
  receiverName,
}: BuildUpdatedPackageParams): Package {
  return {
    ...packageData,

    status,

    deliveryStatus: DeliveryStatus.PENDING,

    receiverName:
      status === PackageStatus.ENTREGUE
        ? receiverName?.trim()
        : undefined,

    sent_at: undefined,
  };
}
