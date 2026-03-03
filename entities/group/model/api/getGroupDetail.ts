import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetGroupDetailResponse } from "./types";

export const getGroupDetail = async (
  groupId: number
): Promise<GetGroupDetailResponse> => {
  const { data } = await api.get<GetGroupDetailResponse>(
    REQUEST_PATHS.GROUPS.DETAIL(groupId)
  );
  return data;
};
