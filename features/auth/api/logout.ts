import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import { clearAccessToken } from "@/shared/lib/access-token";
import { useCurrentUserStore } from "@/entities/user/model/currentUserStore";
import { setAuthSessionHint } from "@/shared/lib/auth-session-hint";

export const logout = async (): Promise<void> => {
  const requestBody = new URLSearchParams();

  await api.post(REQUEST_PATHS.AUTH.LOGOUT, requestBody, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  clearAccessToken();
  setAuthSessionHint(false);
  useCurrentUserStore.getState().setUnauthenticated();
};
