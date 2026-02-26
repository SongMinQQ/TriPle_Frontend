import api from "@/shared/api/common";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetGroupDetailResponse } from "./types";

/**
 * 그룹 상세 정보를 조회한다.
 *
 * @param groupId 조회할 그룹 ID
 */
export const getGroupDetail = async (
  groupId: number
): Promise<GetGroupDetailResponse> => {
  const { data } = await api.get<GetGroupDetailResponse>(
    REQUEST_PATHS.GROUPS.DETAIL(groupId)
  );
  return data;
};
