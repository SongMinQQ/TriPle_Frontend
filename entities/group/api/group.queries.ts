import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicGroups } from "@/shared/api/group/getPublicGroups";
import { toGroupSummaryPage } from "@/entities/group/model/mappers";
import type { GroupSummary, GroupSummaryPage } from "@/entities/group/model/types";

export type { GroupSummary as GroupListItem };

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
};

const fetchPublicGroupsPage = async ({
  cursor,
  size,
}: {
  cursor?: number;
  size: number;
}): Promise<GroupSummaryPage> => {
  const response = await getPublicGroups({ cursor, size });
  return toGroupSummaryPage(response);
};

/**
 * 공개 그룹 목록을 무한 스크롤로 조회하는 React Query 훅.
 *
 * @param options.size 페이지 크기
 */
export const usePublicGroupsInfiniteQuery = ({
  size = DEFAULT_PAGE_SIZE,
}: UsePublicGroupsOptions = {}) =>
  useInfiniteQuery<GroupSummaryPage>({
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
