"use client";

import { useCallback, useEffect, useRef, useState, type UIEvent } from "react";

interface UseVirtualizedScrollOptions {
  itemCount: number;
  rowHeight: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading?: boolean;
  onLoadMore: () => void;
  overscanCount?: number;
  loadMoreThreshold?: number;
}

export const useVirtualizedScroll = ({
  itemCount,
  rowHeight,
  hasNextPage,
  isFetchingNextPage,
  isLoading = false,
  onLoadMore,
  overscanCount = 4,
  loadMoreThreshold = rowHeight * 3,
}: UseVirtualizedScrollOptions) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const tryLoadMore = useCallback(
    (element: HTMLDivElement) => {
      if (!hasNextPage || isFetchingNextPage || isLoading) {
        return;
      }

      const remaining = element.scrollHeight - element.scrollTop - element.clientHeight;

      if (remaining <= loadMoreThreshold) {
        onLoadMore();
      }
    },
    [hasNextPage, isFetchingNextPage, isLoading, loadMoreThreshold, onLoadMore]
  );

  useEffect(() => {
    const element = scrollContainerRef.current;

    if (!element) {
      return;
    }

    const syncViewportHeight = () => {
      setViewportHeight(element.clientHeight);
    };

    syncViewportHeight();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(syncViewportHeight);
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", syncViewportHeight);
    return () => window.removeEventListener("resize", syncViewportHeight);
  }, []);

  useEffect(() => {
    const element = scrollContainerRef.current;

    if (!element) {
      return;
    }

    tryLoadMore(element);
  }, [itemCount, tryLoadMore]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    setScrollTop(target.scrollTop);
    tryLoadMore(target);
  };

  const totalHeight = itemCount * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscanCount);
  const endIndex = Math.min(
    itemCount,
    Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscanCount
  );
  const translateY = startIndex * rowHeight;

  return {
    scrollContainerRef,
    handleScroll,
    totalHeight,
    startIndex,
    endIndex,
    translateY,
  };
};
