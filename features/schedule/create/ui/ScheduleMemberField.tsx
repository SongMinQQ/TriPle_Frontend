import Image from "next/image";
import type { GroupMemberDto } from "@/entities/group/model/api/types";
import { PLACEHOLDERS } from "@/shared/constants/constants";
import { FieldLabelWithCounter } from "@/shared/ui/field-label-with-counter";

interface ScheduleMemberFieldProps {
  members: GroupMemberDto[];
  requiredMemberId: string | null;
  selectedMemberIds: string[];
  onToggleMember: (memberId: string) => void;
}

export function ScheduleMemberField({
  members,
  requiredMemberId,
  selectedMemberIds,
  onToggleMember,
}: ScheduleMemberFieldProps) {
  return (
    <div>
      <FieldLabelWithCounter
        label={
          <span className="inline-flex items-center gap-1">
            <span>{"일정 멤버"}</span>
            <span className="text-primary">{selectedMemberIds.length}</span>
          </span>
        }
      />

      {members.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {members.map((member) => {
            const isSelected = selectedMemberIds.includes(member.id);
            const isRequiredMember = member.id === requiredMemberId;

            return (
              <button
                key={member.id}
                type="button"
                disabled={isRequiredMember}
                onClick={() => onToggleMember(member.id)}
                className={`flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary/15 text-foreground ring-1 ring-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                } ${isRequiredMember ? "cursor-default" : ""}`}
              >
                <Image
                  src={member.profileUrl || PLACEHOLDERS.PROFILE_AVATAR}
                  alt={member.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span className="max-w-28 truncate">{member.name}</span>
                {isRequiredMember ? (
                  <span className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {"나"}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
          그룹원 목록이 없습니다.
        </div>
      )}
    </div>
  );
}
