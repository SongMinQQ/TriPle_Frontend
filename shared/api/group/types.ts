export interface PublicGroupListItemDto {
  groupId: number;
  name: string;
  description: string;
  currentMemberCount: number;
  memberLimit: number;
  thumbNailUrl: string;
}

/**
 * 공개 그룹 목록 조회 API 응답 DTO.
 */
export interface GetPublicGroupsResponse {
  items: PublicGroupListItemDto[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface GetPublicGroupsParams {
  cursor?: number;
  size: number;
}

export interface GroupDetailUserDto {
  name: string;
  description: string;
  profileUrl: string;
  isOwner: boolean;
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

/**
 * 그룹 상세 조회 API 응답 DTO.
 * 목록 아이템 DTO의 공통 필드를 재사용하고 상세 전용 필드를 확장한다.
 */
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

/**
 * 그룹 메뉴 조회 API 응답 DTO.
 * 사이드바에 필요한 최소 필드만 포함한다.
 */
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
