import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";

export const logout = async (): Promise<void> => {
  const requestBody = new URLSearchParams();

  await api.post(REQUEST_PATHS.AUTH.LOGOUT, requestBody, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
