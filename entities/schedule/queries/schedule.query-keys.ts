export const SCHEDULE_QUERY_KEYS = {
  all: ["schedules"] as const,
  groupList: (groupId: number, size: number) =>
    [...SCHEDULE_QUERY_KEYS.all, "group-list", groupId, size] as const,
  detailMeta: (scheduleId: number) =>
    [...SCHEDULE_QUERY_KEYS.all, "detail-meta", scheduleId] as const,
};
