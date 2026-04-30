"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupMembers } from "@/entities/group/model/api/getGroupMembers";
import type { GetGroupMembersResponse } from "@/entities/group/model/api/types";
import { GROUP_QUERY_KEYS } from "./group.query-keys";
import { isValidRouteGroupId, parseRouteGroupId } from "./group.query-utils";

interface UseGroupMembersQueryOptions {
  enabled?: boolean;
}

const fetchGroupMembersForView = async (
  routeGroupId: string
): Promise<GetGroupMembersResponse> => {
  const numericGroupId = parseRouteGroupId(routeGroupId, "group-members");

  try {
    return await getGroupMembers(numericGroupId);
  } catch (error) {
    console.error("[group-members] failed to fetch group members", {
      routeGroupId,
      numericGroupId,
      error,
    });
    throw error;
  }
};

export const useGroupMembersQuery = (
  routeGroupId?: string,
  options: UseGroupMembersQueryOptions = {}
) =>
  useQuery<GetGroupMembersResponse>({
    queryKey: GROUP_QUERY_KEYS.members(routeGroupId ?? ""),
    queryFn: () => fetchGroupMembersForView(routeGroupId ?? ""),
    enabled: isValidRouteGroupId(routeGroupId) && (options.enabled ?? true),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
