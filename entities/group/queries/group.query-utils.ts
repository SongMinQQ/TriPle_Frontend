export const isValidRouteGroupId = (routeGroupId?: string): routeGroupId is string => {
  if (!routeGroupId || !/^\d+$/.test(routeGroupId)) {
    return false;
  }

  const numericGroupId = Number(routeGroupId);
  return Number.isFinite(numericGroupId) && numericGroupId > 0;
};

export const parseRouteGroupId = (routeGroupId: string, queryContext: string): number => {
  const numericGroupId = Number(routeGroupId);

  if (!Number.isFinite(numericGroupId) || numericGroupId <= 0) {
    throw new Error(`[${queryContext}] invalid route group id: ${routeGroupId}`);
  }

  return numericGroupId;
};
