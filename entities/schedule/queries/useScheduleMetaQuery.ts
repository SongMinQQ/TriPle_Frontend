"use client";

import { useQuery } from "@tanstack/react-query";
import { getScheduleMeta } from "@/entities/schedule/model/api/getScheduleMeta";
import {
  mapScheduleMetaResponse,
  type ScheduleMetaViewData,
} from "@/entities/schedule/model/mappers";
import { SCHEDULE_QUERY_KEYS } from "./schedule.query-keys";
import {
  isValidRouteScheduleId,
  parseRouteScheduleId,
} from "./schedule.query-utils";

const fetchScheduleMetaForView = async (
  routeScheduleId: string
): Promise<ScheduleMetaViewData> => {
  const numericScheduleId = parseRouteScheduleId(
    routeScheduleId,
    "schedule-detail-meta"
  );

  try {
    const response = await getScheduleMeta(numericScheduleId);
    return mapScheduleMetaResponse(response);
  } catch (error) {
    console.error("[schedule-detail-meta] failed to fetch schedule meta", {
      routeScheduleId,
      numericScheduleId,
      error,
    });
    throw error;
  }
};

export const useScheduleMetaQuery = (routeScheduleId?: string) =>
  useQuery<ScheduleMetaViewData>({
    queryKey: isValidRouteScheduleId(routeScheduleId)
      ? SCHEDULE_QUERY_KEYS.detailMeta(Number(routeScheduleId))
      : [...SCHEDULE_QUERY_KEYS.all, "detail-meta", "invalid"],
    queryFn: () => fetchScheduleMetaForView(routeScheduleId ?? ""),
    enabled: isValidRouteScheduleId(routeScheduleId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
