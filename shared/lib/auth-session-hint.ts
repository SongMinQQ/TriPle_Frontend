import { AUTH_STORAGE_KEYS } from "@/shared/constants/auth";

const AUTHENTICATED_HINT = "true";
const UNAUTHENTICATED_HINT = "false";

export const getAuthSessionHint = (): boolean | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEYS.SESSION_HINT);

  if (storedValue === AUTHENTICATED_HINT) {
    return true;
  }

  if (storedValue === UNAUTHENTICATED_HINT) {
    return false;
  }

  return null;
};

export const setAuthSessionHint = (isAuthenticated: boolean): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEYS.SESSION_HINT,
    isAuthenticated ? AUTHENTICATED_HINT : UNAUTHENTICATED_HINT
  );
};

export const clearAuthSessionHint = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION_HINT);
};
