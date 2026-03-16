"use client";

import { useState } from "react";
import type { GroupMemberDto } from "@/entities/group/model/api/types";
import {
  getInitialSelectedMemberIds,
  getNextEndDateOnStartDateChange,
  getNextStartDateOnEndDateChange,
  getTodayDate,
  normalizeSelectedMemberIds,
} from "@/features/schedule/create/model/scheduleCreateForm";
import { useScheduleCreateAction } from "@/features/schedule/create/model/useScheduleCreateAction";
import { ScheduleCreateSubmitButton } from "@/features/schedule/create/ui/ScheduleCreateSubmitButton";
import { ScheduleDateRangeField } from "@/features/schedule/create/ui/ScheduleDateRangeField";
import { ScheduleMemberField } from "@/features/schedule/create/ui/ScheduleMemberField";
import { ScheduleNameField } from "@/features/schedule/create/ui/ScheduleNameField";

interface ScheduleCreateFormProps {
  groupId: number;
  members: GroupMemberDto[];
  requiredMemberId: string | null;
}

export function ScheduleCreateForm({
  groupId,
  members,
  requiredMemberId,
}: ScheduleCreateFormProps) {
  const { isSubmitting, requestCreateSchedule } = useScheduleCreateAction(groupId);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<string>(() => getTodayDate());
  const [endDate, setEndDate] = useState<string>(() => getTodayDate());
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(() =>
    getInitialSelectedMemberIds(members, requiredMemberId)
  );

  const handleToggleMember = (memberId: string) => {
    if (memberId === requiredMemberId) {
      return;
    }

    setSelectedMemberIds((prev) =>
      normalizeSelectedMemberIds(
        prev.includes(memberId)
          ? prev.filter((id) => id !== memberId)
          : [...prev, memberId],
        requiredMemberId
      )
    );
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setEndDate((prev) => getNextEndDateOnStartDateChange(value, prev));
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setStartDate((prev) => getNextStartDateOnEndDateChange(prev, value));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await requestCreateSchedule({
      title,
      startDate,
      endDate,
      memberUuids: selectedMemberIds,
    });
  };

  return (
    <form className="mt-8" onSubmit={(event) => void handleSubmit(event)}>
      <div className="space-y-8">
        <ScheduleNameField value={title} onChange={setTitle} />
        <ScheduleDateRangeField
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        <ScheduleMemberField
          members={members}
          requiredMemberId={requiredMemberId}
          selectedMemberIds={selectedMemberIds}
          onToggleMember={handleToggleMember}
        />
      </div>

      <div className="mt-16 flex justify-center">
        <ScheduleCreateSubmitButton disabled={isSubmitting} isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}
