import { Calendar, Share2 } from "lucide-react";
import type { Schedule } from "@/entities/group/model/types";

interface ScheduleDetailHeaderProps {
  schedule: Pick<Schedule, "title" | "startDate" | "endDate">;
}

export function ScheduleDetailHeader({
  schedule,
}: ScheduleDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground">{schedule.title}</h1>
        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{schedule.startDate}</span>
          <span>~</span>
          <Calendar className="h-4 w-4" />
          <span>{schedule.endDate}</span>
        </div>
      </div>
      <button
        type="button"
        aria-label="공유"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
}
