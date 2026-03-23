"use client";

import type { ScheduleSettlementMember } from "@/features/schedule/detail/model/types";
import { ScheduleSettlementMemberListItem } from "@/features/schedule/detail/ui/ScheduleSettlementMemberListItem";

interface ScheduleSettlementMemberListProps {
  members: ScheduleSettlementMember[];
  isManualEditing: boolean;
  memberAmounts: Record<string, string>;
  onAmountChange: (memberId: string, value: string) => void;
}

export function ScheduleSettlementMemberList({
  members,
  isManualEditing,
  memberAmounts,
  onAmountChange,
}: ScheduleSettlementMemberListProps) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {members.map((member) => (
        <ScheduleSettlementMemberListItem
          key={member.id}
          member={member}
          isManualEditing={isManualEditing}
          amountValue={memberAmounts[member.id] ?? ""}
          onAmountChange={onAmountChange}
        />
      ))}
    </div>
  );
}
