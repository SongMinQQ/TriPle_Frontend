import Image from "next/image";
import type { ScheduleSettlementMember } from "@/features/schedule/detail/model/types";

export type ScheduleDetailMember = Pick<
  ScheduleSettlementMember,
  "id" | "name" | "avatar"
>;

interface ScheduleDetailMemberListItemProps {
  member: ScheduleDetailMember;
}

export function ScheduleDetailMemberListItem({
  member,
}: ScheduleDetailMemberListItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={member.avatar || "/placeholder.svg"}
        alt={member.name}
        width={32}
        height={32}
        className="rounded-full object-cover"
      />
      <span className="text-sm text-foreground">{member.name}</span>
    </div>
  );
}
