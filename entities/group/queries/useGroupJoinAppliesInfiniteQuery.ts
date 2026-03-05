"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getGroupJoinApplies } from "@/entities/group/model/api/getGroupJoinApplies";
import type {
  GetGroupJoinAppliesResponse,
  GroupJoinApplyStatus,
} from "@/entities/group/model/api/types";
import { GROUP_QUERY_KEYS } from "./group.query-keys";
import { isValidRouteGroupId, parseRouteGroupId } from "./group.query-utils";

interface UseGroupJoinAppliesOptions {
  routeGroupId?: string;
  status?: GroupJoinApplyStatus;
  size?: number;
}

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_STATUS: GroupJoinApplyStatus = "PENDING";

const normalizeJoinApplyStatus = (status: GroupJoinApplyStatus): GroupJoinApplyStatus => {
  const normalizedStatus = typeof status === "string" ? status.trim().toUpperCase() : "";
  return normalizedStatus || DEFAULT_STATUS;
};

const fetchGroupJoinAppliesPage = async ({
  routeGroupId,
  status,
  cursor,
  size,
}: {
  routeGroupId: string;
  status: GroupJoinApplyStatus;
  cursor?: number;
  size: number;
}): Promise<GetGroupJoinAppliesResponse> => {
  const numericGroupId = parseRouteGroupId(routeGroupId, "group-join-applies");

  return await getGroupJoinApplies({
    groupId: numericGroupId,
    status,
    cursor,
    size,
  });
};

export const useGroupJoinAppliesInfiniteQuery = ({
  routeGroupId,
  status = DEFAULT_STATUS,
  size = DEFAULT_PAGE_SIZE,
}: UseGroupJoinAppliesOptions) => {
  const normalizedStatus = normalizeJoinApplyStatus(status);

  return useInfiniteQuery<GetGroupJoinAppliesResponse>({
    queryKey: GROUP_QUERY_KEYS.joinApplies(routeGroupId ?? "", normalizedStatus, size),
    queryFn: ({ pageParam }) =>
      fetchGroupJoinAppliesPage({
        routeGroupId: routeGroupId ?? "",
        status: normalizedStatus,
        cursor: typeof pageParam === "number" ? pageParam : undefined,
        size,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && typeof lastPage.nextCursor === "number"
        ? lastPage.nextCursor
        : undefined,
    enabled: isValidRouteGroupId(routeGroupId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};
