import { format } from "date-fns";
import type { GroupMemberDto } from "@/entities/group/model/api/types";

export const normalizeSelectedMemberIds = (
  memberIds: string[],
  requiredMemberId: string | null
): string[] => {
  if (!requiredMemberId || memberIds.includes(requiredMemberId)) {
    return memberIds;
  }

  return [requiredMemberId, ...memberIds];
};

export const getInitialSelectedMemberIds = (
  members: GroupMemberDto[],
  requiredMemberId: string | null
): string[] => {
  if (requiredMemberId) {
    return [requiredMemberId];
  }

  return members.length > 0 ? [members[0].id] : [];
};

export const getTodayDate = (): string => format(new Date(), "yyyy-MM-dd");

export const getNextEndDateOnStartDateChange = (
  nextStartDate: string,
  prevEndDate: string
): string => {
  if (!nextStartDate || !prevEndDate || nextStartDate <= prevEndDate) {
    return prevEndDate;
  }

  return nextStartDate;
};

export const getNextStartDateOnEndDateChange = (
  prevStartDate: string,
  nextEndDate: string
): string => {
  if (!nextEndDate || !prevStartDate || nextEndDate >= prevStartDate) {
    return prevStartDate;
  }

  return nextEndDate;
};
