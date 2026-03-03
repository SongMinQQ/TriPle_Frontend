import { REQUEST_PATHS } from "@/shared/constants/paths";
import api from "@/shared/lib/api/client";

/**
 *
 * @param groupId 그룹 ID
 * @returns
 */
export const leaveGroup = async (groupId: number) => {
  const { data } = await api.delete(REQUEST_PATHS.GROUPS.LEAVE(groupId));
  return data;
};
