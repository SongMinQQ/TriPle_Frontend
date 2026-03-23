export const isValidRouteScheduleId = (
  routeScheduleId?: string
): routeScheduleId is string => {
  if (!routeScheduleId || !/^\d+$/.test(routeScheduleId)) {
    return false;
  }

  const numericScheduleId = Number(routeScheduleId);
  return Number.isFinite(numericScheduleId) && numericScheduleId > 0;
};

export const parseRouteScheduleId = (
  routeScheduleId: string,
  queryContext: string
): number => {
  const numericScheduleId = Number(routeScheduleId);

  if (!Number.isFinite(numericScheduleId) || numericScheduleId <= 0) {
    throw new Error(`[${queryContext}] invalid route schedule id: ${routeScheduleId}`);
  }

  return numericScheduleId;
};
