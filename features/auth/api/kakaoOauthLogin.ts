import type { OAuthLoginRequest, OAuthLoginResponse } from "./types";
import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";

const KAKAO_PROVIDER = "KAKAO";

export const kakaoOauthLogin = async (code: string) => {
  const payload: OAuthLoginRequest = {
    code,
    provider: KAKAO_PROVIDER,
  };

  const { data } = await api.post<OAuthLoginResponse>(REQUEST_PATHS.AUTH.LOGIN, payload);
  return data;
};
