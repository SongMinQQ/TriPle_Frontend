"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useScheduleMetaQuery } from "@/entities/schedule/queries/useScheduleMetaQuery";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { showErrorToast } from "@/shared/lib/error-toast";
import { ScheduleDetailHeader } from "@/features/schedule/detail/ui/ScheduleDetailHeader";
import { ScheduleDetailMemberList } from "@/features/schedule/detail/ui/ScheduleDetailMemberList";
import { ScheduleDetailOverviewSkeleton } from "@/features/schedule/detail/ui/ScheduleDetailOverviewSkeleton";
import { GroupDetailQueryErrorState } from "@/widgets/group/detail/ui/GroupDetailQueryErrorState";

const getRouteScheduleId = (scheduleId: string | string[] | undefined): string =>
  Array.isArray(scheduleId) ? scheduleId[0] ?? "" : scheduleId ?? "";

export function ScheduleDetailOverviewSection() {
  const hasShownScheduleMetaErrorToastRef = useRef(false);
  const params = useParams<{ scheduleId: string }>();
  const routeScheduleId = getRouteScheduleId(params?.scheduleId);
  const {
    data: scheduleMeta,
    error: scheduleMetaError,
    isError: isScheduleMetaError,
    refetch: refetchScheduleMeta,
  } = useScheduleMetaQuery(routeScheduleId);

  useEffect(() => {
    if (!isScheduleMetaError) {
      hasShownScheduleMetaErrorToastRef.current = false;
      return;
    }

    if (hasShownScheduleMetaErrorToastRef.current) {
      return;
    }

    showErrorToast({
      error: scheduleMetaError,
      title: TOAST_MESSAGES.SCHEDULE.DETAIL_FAILURE.title,
      fallbackDescription: TOAST_MESSAGES.SCHEDULE.DETAIL_FAILURE.description,
    });
    hasShownScheduleMetaErrorToastRef.current = true;
  }, [isScheduleMetaError, scheduleMetaError]);

  if (isScheduleMetaError) {
    return (
      <GroupDetailQueryErrorState
        onRetry={() => void refetchScheduleMeta()}
        title="여행 메타 정보를 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요."
      />
    );
  }

  if (!scheduleMeta) {
    return <ScheduleDetailOverviewSkeleton />;
  }

  return (
    <section>
      <ScheduleDetailHeader schedule={scheduleMeta.schedule} />
      <ScheduleDetailMemberList members={scheduleMeta.members} />
    </section>
  );
}
