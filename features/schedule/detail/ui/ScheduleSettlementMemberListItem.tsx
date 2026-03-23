"use client";

import Image from "next/image";
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
  return (
    <div className="flex items-center gap-3">
      <Image
        src={member.avatar || "/placeholder.svg"}
        alt={member.name}
        width={40}
        height={40}
        className="shrink-0 rounded-full object-cover"
      />
      <span className="w-16 shrink-0 text-sm font-medium text-foreground">
        {member.name}
      </span>
      <div className="flex-1 text-right">
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
      <div className="w-24 shrink-0">
        <span
          className={`flex items-center justify-end gap-1 text-xs font-medium ${
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
    </div>
  );
}
