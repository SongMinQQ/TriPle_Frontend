import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetGroupMenuResponse } from "./types";

export const getGroupMenu = async (
  groupId: number
): Promise<GetGroupMenuResponse> => {
  const { data } = await api.get<GetGroupMenuResponse>(
    REQUEST_PATHS.GROUPS.MENU(groupId)
  );
  return data;
};
