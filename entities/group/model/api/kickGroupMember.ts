import { REQUEST_PATHS } from "@/shared/constants/paths";
import api from "@/shared/lib/api/client";

export const kickGroupMember = async (
  groupId: number,
  targetUserId: string
): Promise<void> => {
  await api.delete(REQUEST_PATHS.GROUPS.KICK_MEMBER(groupId, targetUserId));
};
