import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import { setAuthSessionHint } from "@/shared/lib/auth-session-hint";
import { clearAccessToken, getAccessToken } from "@/shared/lib/access-token";
import { reissueAccessTokenOnce } from "@/shared/lib/api/reissue-access-token";

let inFlightSessionCheck: Promise<boolean> | null = null;

export const hasUserSession = async (): Promise<boolean> => {
  if (inFlightSessionCheck) {
    return inFlightSessionCheck;
  }

  inFlightSessionCheck = (async () => {
    if (!getAccessToken()) {
      const reissuedAccessToken = await reissueAccessTokenOnce();

      if (!reissuedAccessToken) {
        setAuthSessionHint(false);
        return false;
      }
    }

    const response = await api.get(REQUEST_PATHS.USERS.ME, {
      validateStatus: (status) => status === 200 || status === 404,
    });

    const isAuthenticated = response.status === 200;

    if (!isAuthenticated) {
      clearAccessToken();
    }

    setAuthSessionHint(isAuthenticated);

    return isAuthenticated;
  })();

  try {
    return await inFlightSessionCheck;
  } finally {
    inFlightSessionCheck = null;
  }
};
