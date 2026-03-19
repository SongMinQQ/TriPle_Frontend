import axios from "axios";
import { AUTH_EVENTS } from "@/shared/constants/auth";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { setAuthSessionHint } from "@/shared/lib/auth-session-hint";
import {
  clearCsrfToken,
  CSRF_TOKEN_HEADER,
  getCsrfToken,
  readCsrfTokenFromHeaders,
  setCsrfToken,
} from "@/shared/lib/csrf-token";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  withCredentials: true,
});

const CSRF_REQUIRED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

api.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase();

  if (method && CSRF_REQUIRED_METHODS.has(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      const headers = config.headers as
        | { set?: (key: string, value: string) => void }
        | undefined;

      if (headers?.set) {
        headers.set(CSRF_TOKEN_HEADER, csrfToken);
      } else {
        config.headers = {
          ...config.headers,
          [CSRF_TOKEN_HEADER]: csrfToken,
        };
      }
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const csrfToken = readCsrfTokenFromHeaders(response.headers);
    if (csrfToken) {
      setCsrfToken(csrfToken);
    }

    return response;
  },
  (error) => {
    const csrfToken = readCsrfTokenFromHeaders(error?.response?.headers);
    if (csrfToken) {
      setCsrfToken(csrfToken);
    }

    if (error?.response?.status === 401 && typeof window !== "undefined") {
      clearCsrfToken();
      setAuthSessionHint(false);
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.SESSION_EXPIRED));

      void import("@/shared/hooks/use-toast").then(({ toast }) => {
        toast({
          variant: "destructive",
          title: TOAST_MESSAGES.AUTH.SESSION_EXPIRED.title,
          description: TOAST_MESSAGES.AUTH.SESSION_EXPIRED.description,
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
