"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGroupDetailQuery } from "@/entities/group/queries/useGroupDetailQuery";
import { getMembershipStateFromGroupRole } from "@/features/group/detail/lib/groupMembershipAction";
import { GroupSchedulesContent } from "@/features/schedule/list/ui/GroupSchedulesContent";
import { ScheduleCreateButton } from "@/features/schedule/create/ui/ScheduleCreateButton";
import { GroupDetailQueryErrorState } from "@/widgets/group/detail/ui/GroupDetailQueryErrorState";
import { GroupDetailSectionHeader } from "@/widgets/group/detail/ui/GroupDetailSectionHeader";

const getRouteGroupId = (id: string | string[] | undefined): string =>
  Array.isArray(id) ? id[0] ?? "" : id ?? "";

export default function SchedulesPage() {
  const params = useParams<{ id: string }>();
  const routeGroupId = getRouteGroupId(params?.id);
  const {
    data: group,
    isError: isGroupError,
    refetch: refetchGroup,
  } = useGroupDetailQuery(routeGroupId);
  const [scheduleCount, setScheduleCount] = useState(0);
  const isGuest = getMembershipStateFromGroupRole(group?.role) === "guest";

  useEffect(() => {
    if (!group) {
      return;
    }

    setScheduleCount(group.schedules.length);
  }, [group]);

  if (isGroupError) {
    return <GroupDetailQueryErrorState onRetry={() => void refetchGroup()} />;
  }

  if (!group) {
    return null;
  }

  return (
    <div>
      <GroupDetailSectionHeader title="여행 일정" count={scheduleCount} />

      <GroupSchedulesContent
        groupId={group.id}
        numericGroupId={group.groupId}
        fallbackSchedules={group.schedules}
        isGuest={isGuest}
        onCountChange={setScheduleCount}
      />

      {!isGuest ? (
        <div className="mt-8 flex justify-end">
          <ScheduleCreateButton groupId={group.id} />
        </div>
      ) : null}
    </div>
  );
}
