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
