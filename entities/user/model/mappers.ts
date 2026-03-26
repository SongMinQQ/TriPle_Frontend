import type { UserProfile } from "@/entities/user/model/types";
import { normalizeUserGender } from "@/entities/user/model/gender";
import type { GetMyProfileResponse } from "@/entities/user/model/api/types";

export const mapGetMyProfileResponseToUserProfile = (
  response: GetMyProfileResponse
): UserProfile => ({
  id: response.publicUuid,
  nickname: response.nickname,
  gender: normalizeUserGender(response.gender),
  birth: response.birth,
  description: response.description,
  profileUrl: response.profileUrl,
});
