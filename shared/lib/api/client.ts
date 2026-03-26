import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import { AUTH_EVENTS } from "@/shared/constants/auth";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { setAuthSessionHint } from "@/shared/lib/auth-session-hint";
import {
  AUTHORIZATION_HEADER,
  buildAuthorizationHeaderValue,
  clearAccessToken,
  getAccessToken,
  readAccessTokenFromHeaders,
  setAccessToken,
} from "@/shared/lib/access-token";
import { reissueAccessTokenOnce } from "@/shared/lib/api/reissue-access-token";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

const isAuthRequest = (url: string | undefined): boolean => {
  if (!url) {
    return false;
  }

  return [
    REQUEST_PATHS.AUTH.LOGIN,
    REQUEST_PATHS.AUTH.REFRESH,
    REQUEST_PATHS.AUTH.LOGOUT,
  ].some((path) => url.includes(path));
};

const handleSessionExpired = (): void => {
  clearAccessToken();
  setAuthSessionHint(false);

  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.SESSION_EXPIRED));

  void import("@/shared/hooks/use-toast").then(({ toast }) => {
    toast({
      variant: "destructive",
      title: TOAST_MESSAGES.AUTH.SESSION_EXPIRED.title,
      description: TOAST_MESSAGES.AUTH.SESSION_EXPIRED.description,
    });
  });
};

const hasAuthorizationHeader = (headers: unknown): boolean => {
  if (!headers) {
    return false;
  }

  if (
    typeof headers === "object" &&
    headers !== null &&
    typeof (headers as { get?: unknown }).get === "function"
  ) {
    return Boolean((headers as { get: (headerName: string) => unknown }).get(AUTHORIZATION_HEADER));
  }

  if (typeof headers === "object" && headers !== null) {
    const map = headers as Record<string, unknown>;
    return Boolean(
      map.authorization ?? map.Authorization ?? map[AUTHORIZATION_HEADER]
    );
  }

  return false;
};

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return config;
  }

  const authorizationHeaderValue = buildAuthorizationHeaderValue(accessToken);
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);
  headers.set(AUTHORIZATION_HEADER, authorizationHeaderValue);
  config.headers = headers;

  return config;
});

api.interceptors.response.use(
  (response) => {
    const accessToken = readAccessTokenFromHeaders(response.headers);
    if (accessToken) {
      setAccessToken(accessToken);
      setAuthSessionHint(true);
    }

    return response;
  },
  (error) => {
    const accessToken = readAccessTokenFromHeaders(error?.response?.headers);
    if (accessToken) {
      setAccessToken(accessToken);
      setAuthSessionHint(true);
    }

    const requestConfig = error?.config as RetryableRequestConfig | undefined;
    const hasToken =
      Boolean(getAccessToken()) || hasAuthorizationHeader(requestConfig?.headers);

    if (
      error?.response?.status === 401 &&
      typeof window !== "undefined" &&
      hasToken
    ) {
      if (!requestConfig || requestConfig._retry || isAuthRequest(requestConfig.url)) {
        handleSessionExpired();
        return Promise.reject(error);
      }

      requestConfig._retry = true;

      return reissueAccessTokenOnce().then((reissuedAccessToken) => {
        if (!reissuedAccessToken) {
          handleSessionExpired();
          return Promise.reject(error);
        }

        const headers =
          requestConfig.headers instanceof AxiosHeaders
            ? requestConfig.headers
            : new AxiosHeaders(requestConfig.headers);
        headers.set(
          AUTHORIZATION_HEADER,
          buildAuthorizationHeaderValue(reissuedAccessToken)
        );
        requestConfig.headers = headers;

        return api(requestConfig);
      });
    }

    return Promise.reject(error);
  }
);

export default api;
