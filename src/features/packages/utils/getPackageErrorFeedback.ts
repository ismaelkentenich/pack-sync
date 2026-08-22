import {
  PackageError,
  PackageErrorCode,
  PackageErrorParams,
} from "@features/packages/domain/package.errors";

export type FeedbackMessage = {
  key: string;
  params?: PackageErrorParams;
};

export function getPackageErrorFeedback(
  error: unknown,
): FeedbackMessage {
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
        params: error.params,
      };

    case PackageErrorCode.MULTIPLE_SYNC_FAILED:
      return {
        key: "packages.errors.multipleSyncFailed",
        params: error.params,
      };

    case PackageErrorCode.UNKNOWN:
    default:
      return {
        key: "packages.errors.unknown",
      };
  }
}
