export enum PackageErrorCode {
  ALREADY_SCANNED = "ALREADY_SCANNED",
  RECEIVER_REQUIRED = "RECEIVER_REQUIRED",
  INVALID_FOR_SYNC = "INVALID_FOR_SYNC",
  SYNC_FAILED = "SYNC_FAILED",
  MULTIPLE_SYNC_FAILED = "MULTIPLE_SYNC_FAILED",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  UNKNOWN = "UNKNOWN",
}

export type PackageErrorParams = {
  code?: string;
  count?: number;
};

export class PackageError extends Error {
  constructor(
    public readonly code: PackageErrorCode,
    public readonly params?: PackageErrorParams,
  ) {
    super(code);

    this.name = "PackageError";
  }
}
