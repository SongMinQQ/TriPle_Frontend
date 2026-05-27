import type {
  ScheduleSettlement,
  ScheduleSettlementMember,
} from "@/entities/schedule/model/settlement";

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

export interface CreateScheduleRequest {
  title: string;
  startAt: string;
  endAt: string;
  groupId: number;
  description: string;
  memberUuids: string[];
}

export interface CreateScheduleResponse {
  itineraryId: number;
}

export interface AddScheduleMemberRequest {
  userUuid: string;
}

export type ScheduleMetaMemberRole = "LEADER" | "MEMBER" | string;

export interface ScheduleMetaMemberDto {
  nickname: string;
  profileUrl: string;
  userRole: ScheduleMetaMemberRole;
}

export interface GetScheduleMetaResponse {
  title: string;
  startAt: string;
  endAt: string;
  members: ScheduleMetaMemberDto[];
}

export interface ScheduleSettlementMemberDto
  extends Omit<ScheduleSettlementMember, "avatar" | "amount"> {
  avatar: string | null;
  amount: number | null;
}

export interface GetScheduleSettlementResponse
  extends Omit<
    ScheduleSettlement,
    "accountNumber" | "bankName" | "accountHolder" | "totalAmount" | "members"
  > {
  accountNumber: string | null;
  bankName: string | null;
  accountHolder: string | null;
  totalAmount: number | null;
  members: ScheduleSettlementMemberDto[];
}

export interface UpdateScheduleSettlementMemberRequest {
  id: string;
  amount: number;
}

export interface UpdateScheduleSettlementRequest {
  accountNumber: string;
  bankName: string;
  accountHolder: string;
  totalAmount: number;
  members: UpdateScheduleSettlementMemberRequest[];
}
