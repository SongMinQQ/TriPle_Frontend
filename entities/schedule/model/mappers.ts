import type { Schedule } from "@/entities/group/model/types";
import {
  calculateInclusiveDayCountFromIsoDates,
  formatIsoDateToDot,
} from "@/shared/lib/date";
import type {
  GetGroupSchedulesResponse,
  GroupScheduleListItemDto,
} from "./api/types";

export interface GroupSchedulesViewData {
  items: Schedule[];
  count: number;
  nextCursor: number | null;
  hasNext: boolean;
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
