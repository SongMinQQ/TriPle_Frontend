import {
  AUTH_FALLBACK_PATH,
  AUTH_STORAGE_KEYS,
  KAKAO_CALLBACK_PATH,
} from "@/shared/constants/auth";

/**
 * 경로 유효성을 검사합니다.
 * @param path 검사할 경로
 * @returns 유효한 경로의 경우 해당 경로를 return하고 그렇지 않다면 root 경로를 반환합니다.
 */
const normalizeReturnPath = (path: string | null | undefined) => {
  if (!path || !path.startsWith("/")) {
    return AUTH_FALLBACK_PATH;
  }

  if (path.startsWith(KAKAO_CALLBACK_PATH)) {
    return AUTH_FALLBACK_PATH;
  }

  return path;
};

export const getCurrentPath = () => {
  if (typeof window === "undefined") {
    return AUTH_FALLBACK_PATH;
  }

  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  return path || AUTH_FALLBACK_PATH;
};
/**
 * @param path 사용자의 현재 경로를 기본값으로 가짐
 * sessionStorage에 사용자가 인증 후 돌아올 경로를 저장합니다.
 * @returns 
 */
export const saveOAuthReturnPath = (path = getCurrentPath()) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    AUTH_STORAGE_KEYS.OAUTH_RETURN_PATH,
    normalizeReturnPath(path)
  );
};

/**
 * sessionStorage에 저장된 경로를 storedPath로 반환하고, 브라우저 히스토리 스택에서 해당 항목을 삭제합니다.
 * @returns sessionStorage에 저장된 경로를 return
 */
export const consumeOAuthReturnPath = () => {
  if (typeof window === "undefined") {
    return AUTH_FALLBACK_PATH;
  }

  const storedPath = window.sessionStorage.getItem(AUTH_STORAGE_KEYS.OAUTH_RETURN_PATH);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEYS.OAUTH_RETURN_PATH);

  return normalizeReturnPath(storedPath);
};
