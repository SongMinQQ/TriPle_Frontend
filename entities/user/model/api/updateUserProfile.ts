import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import { mapUpdateUserProfileResponseToUserProfile } from "@/entities/user/model/mappers";
import type {
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
} from "@/entities/user/model/api/types";

export const updateUserProfile = async (profile: UpdateUserProfileRequest) => {
  const { data } = await api.patch<UpdateUserProfileResponse>(
    REQUEST_PATHS.USERS.ROOT,
    profile
  );

  return mapUpdateUserProfileResponseToUserProfile(data);
};
