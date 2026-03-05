/**
 * 그룹 관련 React Query key 모음.
 */
export const GROUP_QUERY_KEYS = {
  all: ["groups"] as const,
  publicList: (size: number, keyword: string) =>
    [...GROUP_QUERY_KEYS.all, "public-list", size, keyword] as const,
  detail: (groupId: string) => [...GROUP_QUERY_KEYS.all, "detail", groupId] as const,
  members: (groupId: string) => [...GROUP_QUERY_KEYS.all, "members", groupId] as const,
  joinApplies: (groupId: string, status: string, size: number) =>
    [...GROUP_QUERY_KEYS.all, "join-applies", groupId, status, size] as const,
  menu: (groupId: string) => [...GROUP_QUERY_KEYS.all, "menu", groupId] as const,
};
