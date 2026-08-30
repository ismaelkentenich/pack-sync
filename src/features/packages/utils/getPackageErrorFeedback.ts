import { TFunction } from "i18next";
import {
  PackageError,
  PackageErrorCode,
} from "@features/packages/domain/package.errors";

export type PackageFeedbackMessage =
  | {
      key: "packages.feedback.scannedSuccessfully";
      params: {
        code: string;
      };
    }
  | {
      key: "packages.feedback.alreadyScanned";
    }
  | {
      key: "packages.feedback.allSentSuccessfully";
    }
  | {
      key: "packages.feedback.sendSomeFailed";
    }
  | {
      key: "packages.errors.receiverRequired";
    }
  | {
      key: "packages.errors.invalidForSync";
    }
  | {
      key: "packages.errors.syncFailed";
      params: {
        code: string;
      };
    }
  | {
      key: "packages.errors.multipleSyncFailed";
      params: {
        count: number;
      };
    }
  | {
      key: "packages.errors.unknown";
    };

export function getPackageErrorFeedback(
  error: unknown,
): PackageFeedbackMessage {
  if (!(error instanceof PackageError)) {
    return {
      key: "packages.errors.unknown",
    };
  }

  switch (error.code) {
    case PackageErrorCode.ALREADY_SCANNED:
      return {
        key: "packages.feedback.alreadyScanned",
      };

    case PackageErrorCode.RECEIVER_REQUIRED:
      return {
        key: "packages.errors.receiverRequired",
      };

    case PackageErrorCode.INVALID_FOR_SYNC:
      return {
        key: "packages.errors.invalidForSync",
      };

    case PackageErrorCode.SYNC_FAILED:
      return {
        key: "packages.errors.syncFailed",
        params: {
          code: error.params?.code ?? "",
        },
      };

    case PackageErrorCode.MULTIPLE_SYNC_FAILED:
      return {
        key: "packages.errors.multipleSyncFailed",
        params: {
          count: error.params?.count ?? 0,
        },
      };

    case PackageErrorCode.UNKNOWN:
    default:
      return {
        key: "packages.errors.unknown",
      };
  }
}

export function translatePackageFeedback(
  t: TFunction,
  feedback: PackageFeedbackMessage,
): string {
  switch (feedback.key) {
    case "packages.feedback.scannedSuccessfully":
      return t(
        "packages.feedback.scannedSuccessfully",
        feedback.params,
      );

    case "packages.feedback.alreadyScanned":
      return t("packages.feedback.alreadyScanned");

    case "packages.feedback.allSentSuccessfully":
      return t("packages.feedback.allSentSuccessfully");

    case "packages.feedback.sendSomeFailed":
      return t("packages.feedback.sendSomeFailed");

    case "packages.errors.receiverRequired":
      return t("packages.errors.receiverRequired");

    case "packages.errors.invalidForSync":
      return t("packages.errors.invalidForSync");

    case "packages.errors.syncFailed":
      return t(
        "packages.errors.syncFailed",
        feedback.params,
      );

    case "packages.errors.multipleSyncFailed":
      return t(
        "packages.errors.multipleSyncFailed",
        feedback.params,
      );

    case "packages.errors.unknown":
    default:
      return t("packages.errors.unknown");
  }
}
