"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupMenu } from "@/entities/group/model/api/getGroupMenu";
import type { GetGroupMenuResponse } from "@/entities/group/model/api/types";
import { GROUP_QUERY_KEYS } from "./group.query-keys";
import { isValidRouteGroupId, parseRouteGroupId } from "./group.query-utils";

const fetchGroupMenuForSidebar = async (
  routeGroupId: string
): Promise<GetGroupMenuResponse> => {
  const numericGroupId = parseRouteGroupId(routeGroupId, "group-menu");

  try {
    return await getGroupMenu(numericGroupId);
  } catch (error) {
    console.error("[group-menu] failed to fetch group menu", {
      routeGroupId,
      numericGroupId,
      error,
    });
    throw error;
  }
};

export const useGroupMenuQuery = (routeGroupId?: string) =>
  useQuery<GetGroupMenuResponse>({
    queryKey: GROUP_QUERY_KEYS.menu(routeGroupId ?? ""),
    queryFn: () => fetchGroupMenuForSidebar(routeGroupId ?? ""),
    enabled: isValidRouteGroupId(routeGroupId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
