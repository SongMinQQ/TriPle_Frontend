import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetPublicGroupsParams, GetPublicGroupsResponse } from "./types";

export const getPublicGroups = async ({
  keyword,
  cursor,
  size = 10,
}: GetPublicGroupsParams): Promise<GetPublicGroupsResponse> => {
  const trimmedKeyword = keyword?.trim();

  const { data } = await api.get<GetPublicGroupsResponse>(REQUEST_PATHS.GROUPS.LIST, {
    params: {
      ...(trimmedKeyword ? { keyword: trimmedKeyword } : {}),
      ...(typeof cursor === "number" ? { cursor } : {}),
      size,
    },
  });

  return data;
};
