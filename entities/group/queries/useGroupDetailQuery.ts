"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupDetail } from "@/entities/group/model/api/getGroupDetail";
import { applyGroupDetailToGroup } from "@/entities/group/model/mappers";
import type { Group } from "@/entities/group/model/types";
import { GROUP_QUERY_KEYS } from "./group.query-keys";
import { isValidRouteGroupId, parseRouteGroupId } from "./group.query-utils";

const createEmptyGroup = (routeGroupId: string): Group => {
  const numericGroupId = Number(routeGroupId);

  return {
    id: routeGroupId,
    // 그룹 ID가 0인 그룹은 존재할 수 없으므로 0으로 처리
    groupId: Number.isFinite(numericGroupId) ? numericGroupId : 0,
    groupKind: "PUBLIC",
    name: "",
    description: "",
    image: "",
    thumbNailUrl: "",
    currentMemberCount: 0,
    memberLimit: 0,
    role: "GUEST",
    members: [],
    schedules: [],
    reviewPhotos: [],
    reviews: [],
  };
};

const fetchGroupDetailForView = async (routeGroupId: string): Promise<Group> => {
  const numericGroupId = parseRouteGroupId(routeGroupId, "group-detail");

  try {
    const detail = await getGroupDetail(numericGroupId);
    return applyGroupDetailToGroup(createEmptyGroup(routeGroupId), detail);
  } catch (error) {
    console.error("[group-detail] failed to fetch group detail", {
      routeGroupId,
      numericGroupId,
      error,
    });
    throw error;
  }
};

/**
 * 그룹 상세 정보를 조회하는 React Query 훅.
 */
export const useGroupDetailQuery = (routeGroupId?: string) =>
  useQuery<Group>({
    queryKey: GROUP_QUERY_KEYS.detail(routeGroupId ?? ""),
    queryFn: () => fetchGroupDetailForView(routeGroupId ?? ""),
    enabled: isValidRouteGroupId(routeGroupId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
