import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { UpdateUserProfileRequest } from "@/entities/user/model/api/types";

export const updateUserProfile = async (
  profile: UpdateUserProfileRequest
): Promise<void> => {
  await api.patch(REQUEST_PATHS.USERS.ROOT, profile);
};
