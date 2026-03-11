import { CalendarRange } from "lucide-react";
import type { Group } from "@/entities/group/model/types";
import { ScheduleCard } from "@/entities/schedule/ui/schedule-card";
import { getMembershipStateFromGroupRole } from "@/features/group/detail/lib/groupMembershipAction";
import { GroupDetailEmptyState } from "@/widgets/group/detail/ui/GroupDetailEmptyState";
import { GroupDetailSectionHeader } from "@/widgets/group/detail/ui/GroupDetailSectionHeader";

interface GroupDetailSchedulesSectionProps {
  group: Group;
}

export function GroupDetailSchedulesSection({
  group,
}: GroupDetailSchedulesSectionProps) {
  const hasSchedules = group.schedules.length > 0;
  const isGuest = getMembershipStateFromGroupRole(group.role) === "guest";

  return (
    <section>
      <GroupDetailSectionHeader
        title="여행 일정"
        count={group.schedules.length}
        href={`/group/${group.id}/schedules`}
      />

      {hasSchedules ? (
        <div className="mt-4 flex flex-col gap-3">
          {group.schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              isLocked={isGuest}
              groupId={group.id}
            />
          ))}
        </div>
      ) : (
        <GroupDetailEmptyState
          title="등록된 여행 일정이 없어요"
          description="새 일정이 생기면 이곳에서 바로 확인할 수 있어요."
          icon={<CalendarRange className="h-5 w-5" />}
        />
      )}
    </section>
  );
}
