export type OAuthProvider = "KAKAO" | "GOOGLE";

export interface OAuthLoginRequest {
  code: string;
  provider: OAuthProvider;
}

export interface OAuthLoginResponse {
  publicUuid?: string;
  nickname: string;
  email: string;
  profileUrl: string;
}

export interface GetMyProfileResponse {
  publicUuid: string;
  nickname: string;
  gender: string;
  birth: string;
  description: string;
  profileUrl: string;
}
