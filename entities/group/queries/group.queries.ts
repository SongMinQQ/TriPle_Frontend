"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getGroupDetail } from "@/entities/group/model/api/getGroupDetail";
import { getGroupMenu } from "@/entities/group/model/api/getGroupMenu";
import { getPublicGroups } from "@/entities/group/model/api/getPublicGroups";
import { applyGroupDetailToGroup } from "@/entities/group/model/mappers";
import type { Group } from "@/entities/group/model/types";
import type {
  GetGroupMenuResponse,
  GetPublicGroupsResponse,
  PublicGroupListItemDto,
} from "@/entities/group/model/api/types";

export type { PublicGroupListItemDto as GroupListItem };

interface UsePublicGroupsOptions {
  size?: number;
}

const DEFAULT_PAGE_SIZE = 20;

/**
 * 그룹 관련 React Query key 모음.
 */
export const GROUP_QUERY_KEYS = {
  all: ["groups"] as const,
  publicList: (size: number) => [...GROUP_QUERY_KEYS.all, "public-list", size] as const,
  detail: (groupId: string) => [...GROUP_QUERY_KEYS.all, "detail", groupId] as const,
  menu: (groupId: string) => [...GROUP_QUERY_KEYS.all, "menu", groupId] as const,
};

const fetchPublicGroupsPage = async ({
  cursor,
  size,
}: {
  cursor?: number;
  size: number;
}): Promise<GetPublicGroupsResponse> => {
  return await getPublicGroups({ cursor, size });
};

const createEmptyGroup = (routeGroupId: string): Group => {
  const numericGroupId = Number(routeGroupId);

  return {
    id: routeGroupId,
    //그룹 ID가 0인 그룹은 존재할 수 없으므로 0으로 처리
    groupId: Number.isFinite(numericGroupId) ? numericGroupId : 0,
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

const isValidRouteGroupId = (routeGroupId?: string): routeGroupId is string => {
  if (!routeGroupId || !/^\d+$/.test(routeGroupId)) {
    return false;
  }

  const numericGroupId = Number(routeGroupId);
  return Number.isFinite(numericGroupId) && numericGroupId > 0;
};

const fetchGroupDetailForView = async (routeGroupId: string): Promise<Group> => {
  const numericGroupId = Number(routeGroupId);

  if (!Number.isFinite(numericGroupId) || numericGroupId <= 0) {
    throw new Error(`[group-detail] invalid route group id: ${routeGroupId}`);
  }

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

const fetchGroupMenuForSidebar = async (
  routeGroupId: string
): Promise<GetGroupMenuResponse> => {
  const numericGroupId = Number(routeGroupId);

  if (!Number.isFinite(numericGroupId) || numericGroupId <= 0) {
    throw new Error(`[group-menu] invalid route group id: ${routeGroupId}`);
  }

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

/**
 * 공개 그룹 목록을 무한 스크롤로 조회하는 React Query 훅.
 *
 * @param options.size 페이지 크기
 */
export const usePublicGroupsInfiniteQuery = ({
  size = DEFAULT_PAGE_SIZE,
}: UsePublicGroupsOptions = {}) =>
  useInfiniteQuery<GetPublicGroupsResponse>({
    queryKey: GROUP_QUERY_KEYS.publicList(size),
    queryFn: ({ pageParam }) =>
      fetchPublicGroupsPage({
        cursor: typeof pageParam === "number" ? pageParam : undefined,
        size,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && typeof lastPage.nextCursor === "number" ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });

/**
 * 그룹 상세 정보를 조회하는 React Query 훅.
 * 실패 시에도 기존 목 데이터를 fallback으로 반환한다.
 */
export const useGroupDetailQuery = (routeGroupId?: string) =>
  useQuery<Group>({
    queryKey: GROUP_QUERY_KEYS.detail(routeGroupId ?? ""),
    queryFn: () => fetchGroupDetailForView(routeGroupId ?? ""),
    enabled: isValidRouteGroupId(routeGroupId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });

export const useGroupMenuQuery = (routeGroupId?: string) =>
  useQuery<GetGroupMenuResponse>({
    queryKey: GROUP_QUERY_KEYS.menu(routeGroupId ?? ""),
    queryFn: () => fetchGroupMenuForSidebar(routeGroupId ?? ""),
    enabled: isValidRouteGroupId(routeGroupId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
