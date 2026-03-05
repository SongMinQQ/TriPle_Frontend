import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type {
  GetGroupJoinAppliesParams,
  GetGroupJoinAppliesResponse,
} from "./types";

const DEFAULT_PAGE_SIZE = 20;

export const getGroupJoinApplies = async ({
  groupId,
  status = "PENDING",
  cursor,
  size = DEFAULT_PAGE_SIZE,
}: GetGroupJoinAppliesParams & { groupId: number }): Promise<GetGroupJoinAppliesResponse> => {
  const { data } = await api.get<GetGroupJoinAppliesResponse>(
    REQUEST_PATHS.GROUPS.JOIN_APPLIES(groupId),
    {
      params: {
        status,
        ...(typeof cursor === "number" ? { cursor } : {}),
        size,
      },
    }
  );

  return data;
};
