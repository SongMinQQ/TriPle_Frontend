import { AUTH_STORAGE_KEYS } from "@/shared/constants/auth";

const CSRF_HEADER_NAME = "X-CSRF-Token";
let csrfTokenCache: string | null = null;

const normalizeToken = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const isHeaderReader = (
  headers: unknown
): headers is {
  get: (headerName: string) => unknown;
} => {
  return (
    typeof headers === "object" &&
    headers !== null &&
    typeof (headers as { get?: unknown }).get === "function"
  );
};

export const readCsrfTokenFromHeaders = (headers: unknown): string | null => {
  if (!headers) {
    return null;
  }

  if (isHeaderReader(headers)) {
    return normalizeToken(headers.get(CSRF_HEADER_NAME));
  }

  if (typeof headers === "object" && headers !== null) {
    const map = headers as Record<string, unknown>;
    return normalizeToken(map["x-csrf-token"] ?? map["X-CSRF-Token"]);
  }

  return null;
};

export const getCsrfToken = (): string | null => {
  if (csrfTokenCache) {
    return csrfTokenCache;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const stored = normalizeToken(
    window.sessionStorage.getItem(AUTH_STORAGE_KEYS.CSRF_TOKEN)
  );
  csrfTokenCache = stored;
  return stored;
};

export const setCsrfToken = (token: string | null | undefined): void => {
  const normalizedToken = normalizeToken(token);
  csrfTokenCache = normalizedToken;

  if (typeof window === "undefined") {
    return;
  }

  if (normalizedToken) {
    window.sessionStorage.setItem(AUTH_STORAGE_KEYS.CSRF_TOKEN, normalizedToken);
    return;
  }

  window.sessionStorage.removeItem(AUTH_STORAGE_KEYS.CSRF_TOKEN);
};

export const clearCsrfToken = (): void => {
  setCsrfToken(null);
};

export const CSRF_TOKEN_HEADER = CSRF_HEADER_NAME;
