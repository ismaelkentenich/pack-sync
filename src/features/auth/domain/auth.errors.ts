export enum AuthErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_EMAIL = "INVALID_EMAIL",
  USER_DISABLED = "USER_DISABLED",
  EMAIL_ALREADY_IN_USE = "EMAIL_ALREADY_IN_USE",
  OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  UNKNOWN = "UNKNOWN",
}

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "AuthError";
  }
}
