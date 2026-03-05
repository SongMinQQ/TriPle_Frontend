export interface PublicGroupListItemDto {
  groupId: number;
  name: string;
  description: string;
  currentMemberCount: number;
  memberLimit: number;
  thumbNailUrl: string;
}

export interface GetPublicGroupsResponse {
  items: PublicGroupListItemDto[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface GetPublicGroupsParams {
  keyword?: string;
  cursor?: number;
  size?: number;
}

export interface GroupUserBaseDto {
  name: string;
  description: string;
  profileUrl: string;
  isOwner: boolean;
}

export interface GroupDetailUserDto extends GroupUserBaseDto {}

export interface GroupMemberDto extends GroupUserBaseDto {
  id: string;
}

export interface GetGroupMembersResponse {
  users: GroupMemberDto[];
}

export type GroupJoinApplyStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

export interface GroupJoinApplyUserDto {
  joinApplyId: number;
  nickname: string;
  description: string;
  profileUrl: string;
  status: GroupJoinApplyStatus;
}

export interface GetGroupJoinAppliesResponse {
  users: GroupJoinApplyUserDto[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface GetGroupJoinAppliesParams {
  status?: GroupJoinApplyStatus;
  cursor?: number;
  size?: number;
}

export interface GroupDetailRecentPhotoDto {
  imageId: number;
  imageUrl: string;
}

export interface GroupDetailRecentTravelDto {
  travelItineraryId: number;
  title: string;
  thumbnailUrl: string;
  description: string;
  memberCount: number;
  memberLimit: number;
  startAt: string;
  endAt: string;
}

export interface GroupDetailRecentReviewDto {
  reviewId: number;
  travelItineraryName: string;
  content: string;
  writerNickname: string;
  imageUrl: string;
  view: number;
  createdAt: string;
}

export type GroupDetailRole = "OWNER" | "MEMBER" | "GUEST" | string;

export interface GetGroupDetailResponse
  extends Pick<
    PublicGroupListItemDto,
    "name" | "description" | "currentMemberCount" | "memberLimit" | "thumbNailUrl"
  > {
  users: GroupDetailUserDto[];
  groupKind: "PUBLIC" | "PRIVATE" | string;
  role?: GroupDetailRole;
  recentPhotos?: GroupDetailRecentPhotoDto[];
  recentTravels?: GroupDetailRecentTravelDto[];
  recentReviews?: GroupDetailRecentReviewDto[];
}

export interface GetGroupMenuResponse
  extends Pick<
    PublicGroupListItemDto,
    "name" | "description" | "currentMemberCount" | "memberLimit" | "thumbNailUrl"
  > {
  role?: GroupDetailRole;
}

export interface GroupGenerateData {
  name: string;
  description: string;
  memberLimit: number;
  groupKind: string;
  thumbNailUrl: string;
}

export interface GroupGenerateResponse {
  groupId: number;
}

export interface GroupUpdateData {
  name: string;
  description: string;
  memberLimit: number;
  groupKind: string;
  thumbNailUrl: string;
}

export interface GroupUpdateResponse {
  groupId: number;
  groupKind: string;
  name: string;
  description: string;
  thumbNailUrl: string;
  memberLimit: number;
  currentMemberCount: number;
}

export type GroupDeleteResponse = Record<string, never>;
