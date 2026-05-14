"use client";

import { useQuery } from "@tanstack/react-query";
import { getScheduleSettlement } from "@/entities/schedule/model/api/getScheduleSettlement";
import { mapScheduleSettlementResponse } from "@/entities/schedule/model/mappers";
import type { ScheduleSettlement } from "@/entities/schedule/model/settlement";
import { SCHEDULE_QUERY_KEYS } from "./schedule.query-keys";
import {
  isValidRouteScheduleId,
  parseRouteScheduleId,
} from "./schedule.query-utils";

const fetchScheduleSettlementForView = async (
  routeScheduleId: string
): Promise<ScheduleSettlement> => {
  const numericScheduleId = parseRouteScheduleId(
    routeScheduleId,
    "schedule-settlement"
  );

  try {
    const response = await getScheduleSettlement(numericScheduleId);
    return mapScheduleSettlementResponse(response);
  } catch (error) {
    console.error("[schedule-settlement] failed to fetch schedule settlement", {
      routeScheduleId,
      numericScheduleId,
      error,
    });
    throw error;
  }
};

export const useScheduleSettlementQuery = (
  routeScheduleId?: string,
  enabled = true
) =>
  useQuery<ScheduleSettlement>({
    queryKey: isValidRouteScheduleId(routeScheduleId)
      ? SCHEDULE_QUERY_KEYS.settlement(Number(routeScheduleId))
      : [...SCHEDULE_QUERY_KEYS.all, "settlement", "invalid"],
    queryFn: () => fetchScheduleSettlementForView(routeScheduleId ?? ""),
    enabled: enabled && isValidRouteScheduleId(routeScheduleId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
