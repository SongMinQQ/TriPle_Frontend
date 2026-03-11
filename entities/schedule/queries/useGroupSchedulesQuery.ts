"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getGroupSchedules } from "@/entities/schedule/model/api/getGroupSchedules";
import {
  mapGroupSchedulesResponse,
  type GroupSchedulesViewData,
} from "@/entities/schedule/model/mappers";
import { SCHEDULE_QUERY_KEYS } from "./schedule.query-keys";

interface UseGroupSchedulesOptions {
  size?: number;
  enabled?: boolean;
}

const DEFAULT_PAGE_SIZE = 10;

const fetchGroupSchedulesPage = async ({
  groupId,
  size,
  cursor,
}: {
  groupId: number;
  size: number;
  cursor?: number;
}
): Promise<GroupSchedulesViewData> => {
  try {
    const response = await getGroupSchedules({ groupId, size, cursor });
    return mapGroupSchedulesResponse(response);
  } catch (error) {
    console.error("[group-schedules] failed to fetch schedules", {
      groupId,
      size,
      cursor,
      error,
    });
    throw error;
  }
};

export const useGroupSchedulesQuery = (
  groupId?: number,
  { size = DEFAULT_PAGE_SIZE, enabled = true }: UseGroupSchedulesOptions = {}
) =>
  useInfiniteQuery<GroupSchedulesViewData>({
    queryKey:
      typeof groupId === "number"
        ? SCHEDULE_QUERY_KEYS.groupList(groupId, size)
        : [...SCHEDULE_QUERY_KEYS.all, "group-list", "invalid", size],
    queryFn: ({ pageParam }) =>
      fetchGroupSchedulesPage({
        groupId: groupId as number,
        size,
        cursor: typeof pageParam === "number" ? pageParam : undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && typeof lastPage.nextCursor === "number"
        ? lastPage.nextCursor
        : undefined,
    enabled:
      enabled &&
      typeof groupId === "number" &&
      Number.isFinite(groupId) &&
      groupId > 0,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
