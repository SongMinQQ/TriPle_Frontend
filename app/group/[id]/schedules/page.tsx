import Link from "next/link"
import { mockGroup } from "@/entities/group/model/mock-data"
import { ScheduleCard } from "@/entities/schedule/ui/schedule-card"

export default async function SchedulesPage() {
  const group = mockGroup

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">
        {"여행 일정"}{" "}
        <span className="text-primary">{group.schedules.length}</span>
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        {group.schedules.map((schedule) => (
          <ScheduleCard key={schedule.id} schedule={schedule} showLockMessage />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          href={`/group/${group.id}/schedules/create`}
          className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {"일정 생성"}
        </Link>
      </div>
    </div>
  )
}
