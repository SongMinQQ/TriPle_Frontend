import { AUTH_STORAGE_KEYS } from "@/shared/constants/auth";

const AUTHORIZATION_HEADER_NAME = "Authorization";
const BEARER_PREFIX = "Bearer";
let accessTokenCache: string | null = null;

const normalizeAccessToken = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith(`${BEARER_PREFIX} `)) {
    const token = trimmed.slice(BEARER_PREFIX.length + 1).trim();
    return token || null;
  }

  return trimmed;
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

export const readAccessTokenFromHeaders = (headers: unknown): string | null => {
  if (!headers) {
    return null;
  }

  if (isHeaderReader(headers)) {
    return normalizeAccessToken(headers.get(AUTHORIZATION_HEADER_NAME));
  }

  if (typeof headers === "object" && headers !== null) {
    const map = headers as Record<string, unknown>;
    return normalizeAccessToken(
      map.authorization ?? map.Authorization ?? map[AUTHORIZATION_HEADER_NAME]
    );
  }

  return null;
};

export const getAccessToken = (): string | null => {
  if (accessTokenCache) {
    return accessTokenCache;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const stored = normalizeAccessToken(
    window.sessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  );
  accessTokenCache = stored;
  return stored;
};

export const setAccessToken = (token: string | null | undefined): void => {
  const normalizedToken = normalizeAccessToken(token);
  accessTokenCache = normalizedToken;

  if (typeof window === "undefined") {
    return;
  }

  if (normalizedToken) {
    window.sessionStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, normalizedToken);
    return;
  }

  window.sessionStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
};

export const clearAccessToken = (): void => {
  setAccessToken(null);
};

export const buildAuthorizationHeaderValue = (token: string): string =>
  `${BEARER_PREFIX} ${token}`;

export const AUTHORIZATION_HEADER = AUTHORIZATION_HEADER_NAME;
