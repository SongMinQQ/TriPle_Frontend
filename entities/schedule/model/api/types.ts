export interface GroupScheduleListItemDto {
  id: number;
  travelId?: number;
  travelItineraryId?: number;
  itineraryId?: number;
  ItineraryId?: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  thumbnailUrl?: string;
  memberCount: number;
  memberLimit?: number;
}

export interface GetGroupSchedulesResponse {
  items: GroupScheduleListItemDto[];
  count: number;
  nextCursor?: number | null;
  hasNext?: boolean;
}

export interface GetGroupSchedulesParams {
  groupId: number;
  size?: number;
  cursor?: number;
}
