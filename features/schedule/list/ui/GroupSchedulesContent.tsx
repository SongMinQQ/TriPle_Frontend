import { useEffect, useRef } from "react";
import { CalendarRange } from "lucide-react";
import type { Schedule } from "@/entities/group/model/types";
import { useGroupSchedulesQuery } from "@/entities/schedule/queries/useGroupSchedulesQuery";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { showErrorToast } from "@/shared/lib/error-toast";
import { useVirtualizedScroll } from "@/shared/hooks/use-virtualized-scroll";
import { ScheduleCard } from "@/entities/schedule/ui/schedule-card";
import InfiniteScrollIndicator from "@/shared/ui/infinite-scroll-indicator";
import { GroupDetailEmptyState } from "@/widgets/group/detail/ui/GroupDetailEmptyState";
import { GroupDetailQueryErrorState } from "@/widgets/group/detail/ui/GroupDetailQueryErrorState";

interface GroupSchedulesContentProps {
  groupId: string;
  numericGroupId: number;
  fallbackSchedules: Schedule[];
  isGuest: boolean;
  onCountChange: (count: number) => void;
}

const PAGE_SIZE = 10;
const CARD_HEIGHT = 100;
const ROW_GAP = 12;
const ROW_HEIGHT = CARD_HEIGHT + ROW_GAP;

export function GroupSchedulesContent({
  groupId,
  numericGroupId,
  fallbackSchedules,
  isGuest,
  onCountChange,
}: GroupSchedulesContentProps) {
  const hasShownScheduleErrorToastRef = useRef(false);
  const {
    data: scheduleList,
    error: scheduleError,
    isError: isScheduleError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch: refetchSchedules,
  } = useGroupSchedulesQuery(numericGroupId, { size: PAGE_SIZE });
  const schedulePages = scheduleList?.pages ?? [];
  const shouldUseFallbackSchedules = isGuest && isScheduleError;
  const schedules = shouldUseFallbackSchedules
    ? fallbackSchedules
    : schedulePages.flatMap((page) => page.items);
  const scheduleCount =
    schedulePages[0]?.count ?? (shouldUseFallbackSchedules ? fallbackSchedules.length : 0);
  const shouldRenderLockedSchedules = isGuest && scheduleCount > 0;
  const shouldUseVirtualizedScroll =
    !shouldUseFallbackSchedules &&
    (Boolean(hasNextPage) || schedules.length > PAGE_SIZE || scheduleCount > PAGE_SIZE);

  const {
    scrollContainerRef,
    handleScroll,
    totalHeight,
    startIndex,
    endIndex,
    translateY,
  } = useVirtualizedScroll({
    itemCount: shouldRenderLockedSchedules ? scheduleCount : schedules.length,
    rowHeight: ROW_HEIGHT,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    isLoading,
    onLoadMore: () => void fetchNextPage(),
  });

  useEffect(() => {
    onCountChange(scheduleCount);
  }, [onCountChange, scheduleCount]);

  useEffect(() => {
    if (!isScheduleError || isGuest) {
      hasShownScheduleErrorToastRef.current = false;
      return;
    }

    if (hasShownScheduleErrorToastRef.current) {
      return;
    }

    showErrorToast({
      error: scheduleError,
      title: TOAST_MESSAGES.SCHEDULE.LIST_FAILURE.title,
      fallbackDescription: TOAST_MESSAGES.SCHEDULE.LIST_FAILURE.description,
    });
    hasShownScheduleErrorToastRef.current = true;
  }, [isGuest, isScheduleError, scheduleError]);

  if (isScheduleError && !isGuest) {
    return (
      <GroupDetailQueryErrorState
        onRetry={() => void refetchSchedules()}
        title="일정 정보를 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요."
      />
    );
  }

  if (!scheduleList && !shouldUseFallbackSchedules) {
    return null;
  }

  if (shouldUseVirtualizedScroll) {
    const visibleSchedules = schedules.slice(startIndex, endIndex);
    const visibleLockedIndices = Array.from(
      { length: Math.max(endIndex - startIndex, 0) },
      (_, index) => startIndex + index
    );

    return (
      <>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          data-testid="group-schedules-scroll"
          className="mt-6 h-[70vh] overflow-y-auto pr-1"
        >
          <div style={{ height: totalHeight, position: "relative" }}>
            <div style={{ transform: `translateY(${translateY}px)` }}>
              {shouldRenderLockedSchedules
                ? visibleLockedIndices.map((index) => (
                    <div key={`locked-schedule-${index}`} style={{ height: ROW_HEIGHT }}>
                      <div style={{ minHeight: CARD_HEIGHT }}>
                        <ScheduleCard isLocked groupId={groupId} />
                      </div>
                    </div>
                  ))
                : visibleSchedules.map((schedule, index) => (
                    <div
                      key={schedule.id || `schedule-${startIndex + index}`}
                      style={{ height: ROW_HEIGHT }}
                    >
                      <div style={{ minHeight: CARD_HEIGHT }}>
                        <ScheduleCard schedule={schedule} groupId={groupId} />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <InfiniteScrollIndicator
          visible={!shouldRenderLockedSchedules}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={Boolean(hasNextPage)}
        />
      </>
    );
  }

  if (shouldRenderLockedSchedules) {
    return (
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: scheduleCount }, (_, index) => (
          <ScheduleCard
            key={`locked-schedule-${index}`}
            isLocked
            groupId={groupId}
          />
        ))}
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <GroupDetailEmptyState
        title="등록된 여행 일정이 없어요"
        description="새 일정이 생기면 이곳에서 바로 확인할 수 있어요."
        icon={<CalendarRange className="h-5 w-5" />}
      />
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {schedules.map((schedule, index) => (
        <ScheduleCard
          key={schedule.id || `schedule-${index}`}
          schedule={schedule}
          groupId={groupId}
        />
      ))}
    </div>
  );
}
