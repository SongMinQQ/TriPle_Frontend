import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

interface ScheduleCreateButtonProps {
  groupId: string | number;
  className?: string;
}

export function ScheduleCreateButton({
  groupId,
  className,
}: ScheduleCreateButtonProps) {
  return (
    <Button asChild className={cn("rounded-full px-8 text-sm font-bold", className)}>
      <Link
        href={`/group/${groupId}/schedules/create`}
        data-testid="schedule-create-button"
      >
        일정 생성
      </Link>
    </Button>
  );
}
