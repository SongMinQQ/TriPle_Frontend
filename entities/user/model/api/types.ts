import type { UserGender } from "@/entities/user/model/gender";

export interface GetMyProfileResponse {
  publicUuid: string;
  nickname: string;
  gender: string;
  birth: string;
  description: string;
  profileUrl: string;
}

export interface UpdateUserProfileRequest {
  nickname?: string;
  gender?: UserGender;
  birth?: string;
  description?: string;
  profileUrl?: string;
}
