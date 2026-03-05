import type { GroupMemberDto } from "@/entities/group/model/api/types";

export type MemberActionType = "kick" | "transfer";

export interface PendingMemberAction {
  type: MemberActionType;
  member: GroupMemberDto;
}

export const getMemberActionTitle = (actionType: MemberActionType): string =>
  actionType === "kick" ? "멤버 추방" : "그룹장 양도";

export const getMemberActionDescription = (
  actionType: MemberActionType,
  memberName: string
): string =>
  actionType === "kick"
    ? `${memberName}님을 그룹에서 추방하시겠어요?`
    : `${memberName}님에게 그룹장 권한을 양도하시겠어요?`;

export const getMemberActionButtonLabel = (actionType: MemberActionType): string =>
  actionType === "kick" ? "추방하기" : "양도하기";
