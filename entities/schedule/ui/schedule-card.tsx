import Link from "next/link";
import { Calendar, Lock, Users } from "lucide-react";
import type { Schedule } from "@/entities/group/model/types";

interface ScheduleCardProps {
  schedule?: Schedule;
  isLocked?: boolean;
  groupId?: string | number;
}

const LOCK_MESSAGE =
  "그룹 멤버에게만 공개된 일정입니다. 그룹에 가입하고 여행을 떠나세요!";

export function ScheduleCard({
  schedule,
  isLocked = false,
  groupId,
}: ScheduleCardProps) {
  if (isLocked) {
    return (
      <div
        data-testid="schedule-lock-message"
        className="flex min-h-20 items-center rounded-xl border border-dashed border-border bg-muted/20 p-4"
      >
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="rounded-full bg-background p-2">
            <Lock className="h-4 w-4 shrink-0" />
          </div>
          <p className="text-sm leading-relaxed">{LOCK_MESSAGE}</p>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return null;
  }

  const content = (
    <>
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-muted">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-bold text-foreground">{schedule.dayCount}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold text-foreground">{schedule.title}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {schedule.startDate} ~ {schedule.endDate}
        </p>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{schedule.memberCount}</span>
        </div>
      </div>
    </>
  );

  const className =
    "flex items-start gap-4 rounded-xl border border-border bg-background p-4";
  const href =
    schedule.id && groupId
      ? `/group/${groupId}/schedules/${schedule.id}`
      : null;

  if (!href) {
    return (
      <article data-testid="schedule-card" className={className}>
        {content}
      </article>
    );
  }

  return (
    <Link
      href={href}
      data-testid="schedule-card"
      className={`${className} transition-shadow hover:shadow-sm`}
    >
      {content}
    </Link>
  );
}
