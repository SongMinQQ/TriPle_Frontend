import type { Schedule } from "@/entities/group/model/types";
import {
  calculateInclusiveDayCountFromIsoDates,
  formatIsoDateToDot,
} from "@/shared/lib/date";
import type {
  GetScheduleMetaResponse,
  GetGroupSchedulesResponse,
  GetScheduleSettlementResponse,
  GroupScheduleListItemDto,
  ScheduleMetaMemberDto,
} from "./api/types";
import type { ScheduleSettlement } from "./settlement";

export interface GroupSchedulesViewData {
  items: Schedule[];
  count: number;
  nextCursor: number | null;
  hasNext: boolean;
}

export interface ScheduleMetaMemberViewData {
  id: string;
  name: string;
  avatar?: string;
  isLeader: boolean;
}

export interface ScheduleMetaViewData {
  schedule: Pick<Schedule, "title" | "startDate" | "endDate">;
  members: ScheduleMetaMemberViewData[];
}

const resolveScheduleId = (schedule: GroupScheduleListItemDto): string => {
  const rawId =
    schedule.id ??
    schedule.travelId ??
    schedule.travelItineraryId ??
    schedule.itineraryId ??
    schedule.ItineraryId;

  return typeof rawId === "number" ? String(rawId) : "";
};

const mapGroupScheduleItem = (schedule: GroupScheduleListItemDto): Schedule => ({
  id: resolveScheduleId(schedule),
  title: schedule.title,
  startDate: formatIsoDateToDot(schedule.startAt),
  endDate: formatIsoDateToDot(schedule.endAt),
  memberCount: schedule.memberCount,
  dayCount: calculateInclusiveDayCountFromIsoDates(
    schedule.startAt,
    schedule.endAt
  ),
});

export const mapGroupSchedulesResponse = (
  response: GetGroupSchedulesResponse
): GroupSchedulesViewData => ({
  items: Array.isArray(response.items)
    ? response.items.map(mapGroupScheduleItem)
    : [],
  count: response.count,
  nextCursor:
    typeof response.nextCursor === "number" ? response.nextCursor : null,
  hasNext: response.hasNext === true,
});

const mapScheduleMetaMember = (
  member: ScheduleMetaMemberDto,
  index: number
): ScheduleMetaMemberViewData => ({
  id: `schedule-member-${index}-${member.nickname}`,
  name: member.nickname,
  avatar: member.profileUrl || undefined,
  isLeader: member.userRole === "LEADER",
});

export const mapScheduleMetaResponse = (
  response: GetScheduleMetaResponse
): ScheduleMetaViewData => ({
  schedule: {
    title: response.title,
    startDate: formatIsoDateToDot(response.startAt),
    endDate: formatIsoDateToDot(response.endAt),
  },
  members: Array.isArray(response.members)
    ? response.members.map(mapScheduleMetaMember)
    : [],
});

export const mapScheduleSettlementResponse = (
  response: GetScheduleSettlementResponse
): ScheduleSettlement => ({
  accountNumber: response.accountNumber ?? "",
  bankName: response.bankName ?? "",
  accountHolder: response.accountHolder ?? "",
  totalAmount: response.totalAmount ?? 0,
  transferStatus: response.transferStatus,
  members: Array.isArray(response.members)
    ? response.members.map((member) => ({
        id: member.id,
        name: member.name,
        avatar: member.avatar ?? undefined,
        amount: member.amount ?? 0,
        settled: member.settled,
      }))
    : [],
});
