/**
 * Toast 메세지 정의
 */
export const TOAST_AUTO_DISMISS_DELAY = 5000;
export const TOAST_REMOVE_DELAY = 400;

export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: {
    title: "로그인 완료",
    description: "로그인에 성공했습니다.",
  },
  LOGIN_FAILURE: {
    title: "로그인 실패",
    description: "잠시 후 다시 시도해 주세요.",
  },
  SESSION_EXPIRED: {
    title: "세션 만료",
    description: "세션이 만료되었습니다. 다시 로그인해 주세요.",
  },
} as const;