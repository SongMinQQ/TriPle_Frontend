import api from "@/shared/api/common";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetPublicGroupsParams, GetPublicGroupsResponse } from "./types";

/**
 * 공개 그룹 목록을 커서 기반으로 조회한다.
 *
 * @param params.cursor 다음 페이지 조회를 위한 커서
 * @param params.size 한 번에 조회할 아이템 개수
 * @returns 그룹 목록과 다음 페이지 정보
 */
export const getPublicGroups = async ({
  cursor,
  size,
}: GetPublicGroupsParams): Promise<GetPublicGroupsResponse> => {
  const { data } = await api.get<GetPublicGroupsResponse>(REQUEST_PATHS.GROUPS.LIST, {
    params: {
      ...(typeof cursor === "number" ? { cursor } : {}),
      size,
    },
  });

  return data;
};
