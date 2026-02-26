import api from "@/shared/api/common";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetGroupMenuResponse } from "./types";

/**
 * 그룹 메뉴 조회 API를 호출한다.
 *
 * @param groupId 그룹 ID
 */
export const getGroupMenu = async (
  groupId: number
): Promise<GetGroupMenuResponse> => {
  const { data } = await api.get<GetGroupMenuResponse>(
    REQUEST_PATHS.GROUPS.MENU(groupId)
  );
  return data;
};
