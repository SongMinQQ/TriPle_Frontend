import api from "@/shared/api/common";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import { clearCsrfToken } from "@/shared/lib/csrf-token";

let inFlightSessionCheck: Promise<boolean> | null = null;

/**
 * 사용자 세션이 존재하는지 검증.
 * 200 => authenticated, 401 => unauthenticated/expired.
 */
export const hasUserSession = async (): Promise<boolean> => {
  if (inFlightSessionCheck) {
    return inFlightSessionCheck;
  }

  inFlightSessionCheck = (async () => {
    const response = await api.get(REQUEST_PATHS.USERS.ME, {
      validateStatus: (status) => status === 200 || status === 401,
    });

    const isAuthenticated = response.status === 200;

    if (!isAuthenticated) {
      clearCsrfToken();
    }

    return isAuthenticated;
  })();

  try {
    return await inFlightSessionCheck;
  } finally {
    inFlightSessionCheck = null;
  }
};
