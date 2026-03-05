import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetGroupMembersResponse } from "./types";

export const getGroupMembers = async (
  groupId: number
): Promise<GetGroupMembersResponse> => {
  const { data } = await api.get<GetGroupMembersResponse>(
    REQUEST_PATHS.GROUPS.MEMBERS(groupId)
  );

  return data;
};
