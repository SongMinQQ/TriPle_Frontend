import { REQUEST_PATHS } from "@/shared/constants/paths";
import api from "@/shared/lib/api/client";
import type { GroupDeleteResponse } from "./types";

/**
 * 그룹을 삭제합니다.
 *
 * @param groupId 삭제할 그룹 ID
 * @returns 서버 응답 본문
 */
export const deleteGroup = async (
  groupId: number
): Promise<GroupDeleteResponse> => {
  const { data } = await api.delete<GroupDeleteResponse>(
    REQUEST_PATHS.GROUPS.DETAIL(groupId)
  );
  return data;
};
