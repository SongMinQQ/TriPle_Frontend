import { Plus } from "lucide-react";
import {
  ScheduleDetailMemberListItem,
  type ScheduleDetailMember,
} from "@/features/schedule/detail/ui/ScheduleDetailMemberListItem";

interface ScheduleDetailMemberListProps {
  members: ScheduleDetailMember[];
}

export function ScheduleDetailMemberList({
  members,
}: ScheduleDetailMemberListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-foreground">
        {"일정 멤버"} <span className="text-primary">{members.length}</span>
      </h3>
      <div className="mt-3 flex items-center gap-2">
        {members.map((member) => (
          <ScheduleDetailMemberListItem key={member.id} member={member} />
        ))}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
