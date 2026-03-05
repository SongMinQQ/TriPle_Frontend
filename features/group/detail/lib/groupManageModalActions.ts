/**
 * 그룹 관리 모달에서 선택할 수 있는 옵션 타입입니다.
 */
export type GroupManageOption =
  | "edit-group-info"
  | "manage-join-requests"
  | "delete-group";

export const GROUP_DELETE_OPTION: GroupManageOption = "delete-group";

/**
 * 전달된 옵션이 그룹 삭제 옵션인지 판별합니다.
 */
export const isGroupDeleteOption = (option: GroupManageOption): boolean =>
  option === GROUP_DELETE_OPTION;

/**
 * 그룹 관리 모달 버튼 스키마입니다.
 */
export interface GroupManageActionButton<Option extends string = string> {
  option: Option;
  name: string;
  tone?: "default" | "destructive";
}

/**
 * 그룹 관리 모달에서 노출할 버튼 목록입니다.
 */
export const GROUP_MANAGE_MODAL_ACTIONS: ReadonlyArray<
  GroupManageActionButton<GroupManageOption>
> = [
  {
    option: "edit-group-info",
    name: "그룹 정보 수정",
  },
  {
    option: "manage-join-requests",
    name: "가입 신청 관리",
  },
  {
    option: GROUP_DELETE_OPTION,
    name: "그룹 삭제",
    tone: "destructive",
  },
];
