import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetPublicGroupsParams, GetPublicGroupsResponse } from "./types";

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
