import type { UserProfile } from "@/entities/user/model/types";
import { normalizeUserGender } from "@/entities/user/model/gender";
import type {
  GetMyProfileResponse,
  UpdateUserProfileResponse,
} from "@/entities/user/model/api/types";

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

export const mapUpdateUserProfileResponseToUserProfile = (
  response: UpdateUserProfileResponse
): UserProfile => ({
  id: response.userId,
  nickname: response.nickname,
  gender: normalizeUserGender(response.gender),
  birth: response.birth,
  description: response.description,
  profileUrl: response.profileUrl,
});
