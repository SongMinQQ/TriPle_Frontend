import type { GroupDetailRole } from "@/entities/group/model/api/types";

/** 그룹 멤버십 상태에 따라 노출할 CTA 버튼 액션 타입 */
export type GroupMembershipAction = "manage" | "join" | "leave";
/** 그룹 상세에서 사용하는 사용자 멤버십 상태 */
export type GroupMembershipState = "owner" | "member" | "guest";

interface GroupMembershipActionControl {
  disabled: boolean;
  onClick?: () => void;
}

interface GetGroupMembershipActionControlParams {
  action: GroupMembershipAction;
  isJoining: boolean;
  isLeaving: boolean;
  requestJoinGroup: () => Promise<unknown>;
  requestLeaveGroup: () => Promise<unknown>;
}

const ROLE_TO_MEMBERSHIP_STATE: Record<string, GroupMembershipState> = {
  OWNER: "owner",
  MEMBER: "member",
};

const MEMBERSHIP_STATE_TO_ACTION: Record<
  GroupMembershipState,
  GroupMembershipAction
> = {
  owner: "manage",
  member: "leave",
  guest: "join",
};

const MEMBERSHIP_ACTION_CONTROL_RESOLVER: Record<
  GroupMembershipAction,
  (params: GetGroupMembershipActionControlParams) => GroupMembershipActionControl
> = {
  manage: () => ({
    disabled: false,
  }),
  join: ({ isJoining, requestJoinGroup }) => ({
    disabled: isJoining,
    onClick: () => void requestJoinGroup(),
  }),
  leave: ({ isLeaving, requestLeaveGroup }) => ({
    disabled: isLeaving,
    onClick: () => void requestLeaveGroup(),
  }),
};

/**
 * API role 값을 화면에서 사용하는 멤버십 상태로 변환합니다.
 *
 * @param role 서버에서 전달된 그룹 역할 값
 * @returns owner/member/guest 중 하나
 */
export function getMembershipStateFromGroupRole(
  role: GroupDetailRole | undefined
): GroupMembershipState {
  const normalizedRole = typeof role === "string" ? role.toUpperCase() : "";
  return ROLE_TO_MEMBERSHIP_STATE[normalizedRole] ?? "guest";
}

/**
 * 멤버십 상태를 기준으로 버튼 액션을 결정합니다.
 *
 * @param membershipState 사용자 멤버십 상태
 * @returns manage/join/leave 중 하나
 */
export function getGroupMembershipAction(
  membershipState: GroupMembershipState
): GroupMembershipAction {
  return MEMBERSHIP_STATE_TO_ACTION[membershipState];
}

/**
 * API role 값에서 바로 버튼 액션을 계산합니다.
 *
 * @param role 서버에서 전달된 그룹 역할 값
 * @returns manage/join/leave 중 하나
 */
export function getGroupMembershipActionFromRole(
  role: GroupDetailRole | undefined
): GroupMembershipAction {
  return getGroupMembershipAction(getMembershipStateFromGroupRole(role));
}

/**
 * 현재 액션과 요청 진행 상태를 기준으로 버튼 제어 정보(disabled/onClick)를 제공합니다.
 *
 * @param params 액션 타입 및 join/leave 요청 상태/핸들러
 * @returns 버튼 비활성 여부와 클릭 핸들러
 */
export function getGroupMembershipActionControl({
  action,
  ...params
}: GetGroupMembershipActionControlParams): GroupMembershipActionControl {
  return MEMBERSHIP_ACTION_CONTROL_RESOLVER[action]({
    action,
    ...params,
  });
}
