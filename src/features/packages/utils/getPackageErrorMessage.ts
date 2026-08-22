import {
  PackageError,
  PackageErrorCode,
} from "@features/packages/domain/package.errors";
import { TFunction } from "i18next";

export function getPackageErrorMessage(
  error: unknown,
  t: TFunction,
): string {
  if (!(error instanceof PackageError)) {
    return t("packages.errors.unknown");
  }

  switch (error.code) {
    case PackageErrorCode.ALREADY_SCANNED:
      return t("packages.feedback.alreadyScanned");

    case PackageErrorCode.RECEIVER_REQUIRED:
      return t("packages.errors.receiverRequired");

    case PackageErrorCode.INVALID_FOR_SYNC:
      return t("packages.errors.invalidForSync");

    case PackageErrorCode.SYNC_FAILED:
      return t("packages.errors.syncFailed", {
        code: error.params?.code ?? "",
      });

    case PackageErrorCode.MULTIPLE_SYNC_FAILED:
      return t("packages.errors.multipleSyncFailed", {
        count: error.params?.count ?? 0,
      });

    case PackageErrorCode.UNKNOWN:
    default:
      return t("packages.errors.unknown");
  }
}
