import Image from "next/image";
import { X } from "lucide-react";
import { PLACEHOLDERS } from "@/shared/constants/constants";
import type { ScheduleSettlementMember } from "@/features/schedule/detail/model/types";

export type ScheduleDetailMember = Pick<
  ScheduleSettlementMember,
  "id" | "name" | "avatar"
>;

interface ScheduleDetailMemberListItemProps {
  member: ScheduleDetailMember;
  canRemove?: boolean;
  isRemoving?: boolean;
  onRemove?: () => void;
}

export function ScheduleDetailMemberListItem({
  member,
  canRemove = false,
  isRemoving = false,
  onRemove,
}: ScheduleDetailMemberListItemProps) {
  return (
    <div className="group flex items-center gap-2">
      <Image
        src={member.avatar || PLACEHOLDERS.PROFILE_AVATAR}
        alt={member.name}
        width={32}
        height={32}
        style={{
          width: 32,
          height: 32,
        }}
        className="shrink-0 rounded-full object-cover"
      />
      <span className="text-sm text-foreground">{member.name}</span>
      {canRemove ? (
        <button
          type="button"
          aria-label={`${member.name} 일정 탈퇴`}
          disabled={isRemoving}
          onClick={onRemove}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
