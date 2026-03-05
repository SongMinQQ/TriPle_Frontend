"use client";

import { useCallback, useMemo } from "react";
import { usePublicGroupsInfiniteQuery } from "@/entities/group/queries/usePublicGroupsInfiniteQuery";
import { useVirtualizedScroll } from "@/shared/hooks/use-virtualized-scroll";
import InfiniteScrollIndicator from "@/shared/ui/infinite-scroll-indicator";
import GroupItem from "./ui/GroupItem";
import StatusCard, { type StatusCardStatus } from "./ui/StatusCard";

const PAGE_SIZE = 20;
const CARD_HEIGHT = 170;
const ROW_GAP = 16;
const ROW_HEIGHT = CARD_HEIGHT + ROW_GAP;

type GroupListContentState = StatusCardStatus | "ready";

const getGroupListContentState = ({
  isLoading,
  isError,
  groupCount,
}: {
  isLoading: boolean;
  isError: boolean;
  groupCount: number;
}): GroupListContentState => {
  if (isLoading) {
    return "loading";
  }

  if (isError) {
    return "error";
  }

  if (groupCount === 0) {
    return "empty";
  }

  return "ready";
};

const GroupList = () => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    usePublicGroupsInfiniteQuery({
      size: PAGE_SIZE,
    });

  const groups = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const handleLoadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  const { scrollContainerRef, handleScroll, totalHeight, startIndex, endIndex, translateY } =
    useVirtualizedScroll({
      itemCount: groups.length,
      rowHeight: ROW_HEIGHT,
      hasNextPage: Boolean(hasNextPage),
      isFetchingNextPage,
      isLoading,
      onLoadMore: handleLoadMore,
    });

  const visibleGroups = groups.slice(startIndex, endIndex);
  const contentState = getGroupListContentState({
    isLoading,
    isError,
    groupCount: groups.length,
  });

  const content = (() => {
    if (contentState === "loading") {
      return <StatusCard status="loading" />;
    }

    if (contentState === "error") {
      return <StatusCard status="error" />;
    }

    if (contentState === "empty") {
      return <StatusCard status="empty" />;
    }

    return (
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${translateY}px)` }}>
          {visibleGroups.map((group) => (
            <div key={group.groupId} style={{ height: ROW_HEIGHT }}>
              <div style={{ height: CARD_HEIGHT }}>
                <GroupItem group={group} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  })();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-foreground">그룹 둘러보기</h2>

      <div ref={scrollContainerRef} onScroll={handleScroll} className="h-[70vh] overflow-y-auto pr-1">
        {content}
      </div>

      <InfiniteScrollIndicator
        visible={contentState === "ready"}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={Boolean(hasNextPage)}
      />
    </section>
  );
};

export default GroupList;
