export type OAuthProvider = "KAKAO" | "GOOGLE";

export interface OAuthLoginRequest {
  code: string;
  provider: OAuthProvider;
}

export interface OAuthLoginResponse {
  nickname: string;
  email: string;
  profileUrl: string;
}
