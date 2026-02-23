import type {
  GetPublicGroupsResponse,
  PublicGroupListItemDto,
} from "@/shared/api/group/types";
import type { GroupSummary, GroupSummaryPage } from "./types";

export const toGroupSummary = (dto: PublicGroupListItemDto): GroupSummary => ({
  groupId: dto.groupId,
  name: dto.name,
  description: dto.description,
  currentMemberCount: dto.currentMemberCount,
  memberLimit: dto.memberLimit,
  thumbNailUrl: dto.thumbNailUrl,
});

export const toGroupSummaryPage = (
  response: GetPublicGroupsResponse
): GroupSummaryPage => ({
  items: response.items.map(toGroupSummary),
  nextCursor: response.nextCursor,
  hasNext: response.hasNext,
});
