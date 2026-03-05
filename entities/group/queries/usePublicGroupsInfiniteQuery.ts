"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicGroups } from "@/entities/group/model/api/getPublicGroups";
import type {
  GetPublicGroupsResponse,
  PublicGroupListItemDto,
} from "@/entities/group/model/api/types";
import { GROUP_QUERY_KEYS } from "./group.query-keys";

export type GroupListItem = PublicGroupListItemDto;

interface UsePublicGroupsOptions {
  size?: number;
  keyword?: string;
}

const DEFAULT_PAGE_SIZE = 20;

const fetchPublicGroupsPage = async ({
  keyword,
  cursor,
  size,
}: {
  keyword?: string;
  cursor?: number;
  size: number;
}): Promise<GetPublicGroupsResponse> => {
  return await getPublicGroups({ keyword, cursor, size });
};

/**
 * 공개 그룹 목록을 무한 스크롤로 조회하는 React Query 훅.
 *
 * @param options.size 페이지 크기
 * @param options.keyword 검색 키워드
 */
export const usePublicGroupsInfiniteQuery = ({
  size = DEFAULT_PAGE_SIZE,
  keyword,
}: UsePublicGroupsOptions = {}) => {
  const normalizedKeyword = keyword?.trim() ?? "";

  return useInfiniteQuery<GetPublicGroupsResponse>({
    queryKey: GROUP_QUERY_KEYS.publicList(size, normalizedKeyword),
    queryFn: ({ pageParam }) =>
      fetchPublicGroupsPage({
        keyword: normalizedKeyword || undefined,
        cursor: typeof pageParam === "number" ? pageParam : undefined,
        size,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && typeof lastPage.nextCursor === "number"
        ? lastPage.nextCursor
        : undefined,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
};
