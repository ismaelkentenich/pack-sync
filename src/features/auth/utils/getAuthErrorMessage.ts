import { TFunction } from "i18next";
import {
  AuthError,
  AuthErrorCode,
} from "@features/auth/domain/auth.errors";

export function getAuthErrorMessage(
  error: unknown,
  t: TFunction,
): string {
  if (!(error instanceof AuthError)) {
    return t("auth.errors.unknown");
  }

  switch (error.code) {
    case AuthErrorCode.INVALID_CREDENTIALS:
      return t("auth.errors.invalidCredentials");

    case AuthErrorCode.USER_NOT_FOUND:
      return t("auth.errors.userNotFound");

    case AuthErrorCode.INVALID_EMAIL:
      return t("auth.errors.invalidEmail");

    case AuthErrorCode.USER_DISABLED:
      return t("auth.errors.userDisabled");

    case AuthErrorCode.EMAIL_ALREADY_IN_USE:
      return t("auth.errors.emailAlreadyInUse");

    case AuthErrorCode.OPERATION_NOT_ALLOWED:
      return t("auth.errors.operationNotAllowed");

    case AuthErrorCode.WEAK_PASSWORD:
      return t("auth.errors.weakPassword");

    case AuthErrorCode.UNKNOWN:
    default:
      return t("auth.errors.unknown");
  }
}
