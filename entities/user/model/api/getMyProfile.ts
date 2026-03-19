import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import { mapGetMyProfileResponseToUserProfile } from "@/entities/user/model/mappers";
import type { GetMyProfileResponse } from "@/entities/user/model/api/types";

export const getMyProfile = async () => {
  const { data } = await api.get<GetMyProfileResponse>(REQUEST_PATHS.USERS.ME);

  return mapGetMyProfileResponseToUserProfile(data);
};
