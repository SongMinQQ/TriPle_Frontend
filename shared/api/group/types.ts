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