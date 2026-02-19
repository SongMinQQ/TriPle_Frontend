export const AUTH_FALLBACK_PATH = "/";
export const KAKAO_CALLBACK_PATH = "/kakao";

export const AUTH_STORAGE_KEYS = {
  OAUTH_RETURN_PATH: "auth.oauth.returnPath",
} as const;

export const AUTH_EVENTS = {
  SESSION_EXPIRED: "auth:session-expired",
} as const;
