import axios from "axios";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import { setAuthSessionHint } from "@/shared/lib/auth-session-hint";
import { readAccessTokenFromHeaders, setAccessToken } from "@/shared/lib/access-token";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let inFlightTokenReissue: Promise<string | null> | null = null;

const requestAccessTokenReissue = async (): Promise<string | null> => {
  const requestBody = new URLSearchParams();
  const response = await authApi.post(REQUEST_PATHS.AUTH.REFRESH, requestBody, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    validateStatus: (status) => status === 200 || status === 401,
  });

  if (response.status !== 200) {
    return null;
  }

  const accessToken = readAccessTokenFromHeaders(response.headers);

  if (!accessToken) {
    return null;
  }

  setAccessToken(accessToken);
  setAuthSessionHint(true);

  return accessToken;
};

export const reissueAccessTokenOnce = async (): Promise<string | null> => {
  if (inFlightTokenReissue) {
    return inFlightTokenReissue;
  }

  inFlightTokenReissue = requestAccessTokenReissue().finally(() => {
    inFlightTokenReissue = null;
  });

  return inFlightTokenReissue;
};
