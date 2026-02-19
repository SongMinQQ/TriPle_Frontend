import type { OAuthLoginRequest, OAuthLoginResponse } from "@/features/auth/types/auth";
import api from "@/shared/api/common";
import { REQUEST_PATHS } from "@/shared/constants/paths";

const KAKAO_PROVIDER = "KAKAO";

/**
 * @param code 
 * 카카오 로그인 시 발급받는 인가 코드
 * @returns 
 */
export const kakaoOauthLogin = async (code: string) => {
  const payload: OAuthLoginRequest = {
    code,
    provider: KAKAO_PROVIDER,
  };

  const { data } = await api.post<OAuthLoginResponse>(REQUEST_PATHS.AUTH.LOGIN, payload);
  return data;
};
