"use client";

import type { Member } from "@/entities/group/model/types";
import { MemberCard } from "@/entities/member/ui/member-card";
import type { ScheduleSettlementMember } from "@/features/schedule/detail/model/types";

interface ScheduleSettlementMemberListItemProps {
  member: ScheduleSettlementMember;
  isManualEditing: boolean;
  amountValue: string;
  onAmountChange: (memberId: string, value: string) => void;
}

export function ScheduleSettlementMemberListItem({
  member,
  isManualEditing,
  amountValue,
  onAmountChange,
}: ScheduleSettlementMemberListItemProps) {
  const memberCardData: Member = {
    id: member.id,
    name: member.name,
    avatar: member.avatar,
    bio: "",
  };

  return (
    <MemberCard
      member={memberCardData}
      profileImageSize={40}
      action={
        <div className="flex items-center gap-3">
          <div className="text-right">
            {isManualEditing ? (
              <input
                type="text"
                inputMode="numeric"
                value={amountValue}
                onChange={(event) => onAmountChange(member.id, event.target.value)}
                className="w-28 border-b-2 border-primary bg-transparent text-right text-sm font-bold text-foreground outline-none"
                placeholder="0"
              />
            ) : (
              <span className="text-sm font-bold text-foreground">
                {member.amount.toLocaleString()}
              </span>
            )}
            <span className="ml-1 text-sm text-foreground">{"원"}</span>
          </div>
          <span
            className={`flex w-24 items-center justify-end gap-1 text-xs font-medium ${
              member.settled ? "text-green-600" : "text-red-500"
            }`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                member.settled ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {member.settled ? "정산 완료" : "정산 미완료"}
          </span>
        </div>
      }
    />
  );
}
