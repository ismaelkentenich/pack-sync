export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function hasErrorCode(error: unknown): error is { code: string } {
  return isObject(error) && "code" in error && isString(error.code);
}

export function hasErrorMessage(error: unknown): error is { message: string } {
  return isObject(error) && "message" in error && isString(error.message);
}

export function getErrorMessage(error: unknown, fallback = "Um erro ocorreu"): string {
  if (isError(error)) {
    return error.message;
  }
  if (hasErrorMessage(error)) {
    return error.message;
  }
  if (isString(error)) {
    return error;
  }
  return fallback;
}

export function isFirebaseAuthError(error: unknown): error is { code: string; message: string } {
  return hasErrorCode(error) && error.code.startsWith("auth/");
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isNonEmptyArray<T>(value: T[]): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}
