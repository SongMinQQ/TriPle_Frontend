import Link from "next/link"
import { Calendar, Users, Lock } from "lucide-react"
import type { Schedule } from "@/entities/group/model/mock-data"

interface ScheduleCardProps {
  schedule: Schedule
  showLockMessage?: boolean
  groupId?: string
}

export function ScheduleCard({ schedule, showLockMessage = false, groupId = "1" }: ScheduleCardProps) {
  return (
    <Link
      href={`/group/${groupId}/schedules/${schedule.id}`}
      className="flex items-start gap-4 rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-sm"
    >
      {/* Calendar icon */}
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-muted">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-bold text-foreground">{schedule.dayCount}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground truncate">{schedule.title}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {schedule.startDate} ~ {schedule.endDate}
        </p>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{schedule.memberCount}</span>
        </div>
      </div>

      {/* Lock message */}
      {showLockMessage && (
        <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
          <Lock className="h-4 w-4 shrink-0" />
          <p className="leading-relaxed">{"그룹 멤버에게만 공개된 일정입니다. 그룹에 가입하고 여행을 떠나세요!"}</p>
        </div>
      )}
    </Link>
  )
}
