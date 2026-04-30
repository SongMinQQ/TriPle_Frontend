"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { GroupMemberDto } from "@/entities/group/model/api/types";
import type { Member } from "@/entities/group/model/types";
import { useGroupMembersQuery } from "@/entities/group/queries/useGroupMembersQuery";
import { MemberCard } from "@/entities/member/ui/member-card";
import { useMyProfileQuery } from "@/entities/user/queries/useMyProfileQuery";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { showErrorToast } from "@/shared/lib/error-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  ScheduleDetailMemberListItem,
  type ScheduleDetailMember,
} from "@/features/schedule/detail/ui/ScheduleDetailMemberListItem";
import {
  createCurrentUserGroupMember,
  normalizeScheduleMemberIdentityValue,
} from "@/features/schedule/common/model/scheduleMembers";
import { useScheduleMemberManageAction } from "@/features/schedule/detail/model/useScheduleMemberManageAction";

interface ScheduleDetailMemberListProps {
  members: ScheduleDetailMember[];
  routeGroupId: string;
  routeScheduleId: string;
}

const getScheduleMemberIdentity = (member: ScheduleDetailMember): string =>
  `${normalizeScheduleMemberIdentityValue(member.name)}:${normalizeScheduleMemberIdentityValue(member.avatar)}`;

const getGroupMemberIdentity = (member: GroupMemberDto): string =>
  `${normalizeScheduleMemberIdentityValue(member.name)}:${normalizeScheduleMemberIdentityValue(member.profileUrl)}`;

const getAvailableGroupMembers = (
  groupMembers: GroupMemberDto[],
  scheduleMembers: ScheduleDetailMember[]
): GroupMemberDto[] => {
  const scheduleMemberIdentities = new Set(
    scheduleMembers.map(getScheduleMemberIdentity)
  );

  return groupMembers.filter(
    (groupMember) => !scheduleMemberIdentities.has(getGroupMemberIdentity(groupMember))
  );
};

const mapGroupMemberToMember = (member: GroupMemberDto): Member => ({
  id: member.id,
  name: member.name,
  avatar: member.profileUrl || undefined,
  bio: member.description || "그룹원",
  isLeader: member.isOwner,
});

export function ScheduleDetailMemberList({
  members,
  routeGroupId,
  routeScheduleId,
}: ScheduleDetailMemberListProps) {
  const [isInviteListOpen, setIsInviteListOpen] = useState(false);
  const hasShownGroupMembersErrorToastRef = useRef(false);
  const { data: currentUser } = useMyProfileQuery();
  const {
    addingMemberId,
    isLeavingSchedule,
    requestAddScheduleMember,
    requestLeaveSchedule,
  } = useScheduleMemberManageAction({
    routeGroupId,
    routeScheduleId,
  });
  const {
    data: groupMembersResponse,
    error: groupMembersError,
    isError: isGroupMembersError,
    isFetching: isFetchingGroupMembers,
    refetch: refetchGroupMembers,
  } = useGroupMembersQuery(routeGroupId, {
    enabled: isInviteListOpen,
  });
  const groupMembers = groupMembersResponse?.users ?? [];
  const availableGroupMembers = useMemo(
    () => getAvailableGroupMembers(groupMembers, members),
    [groupMembers, members]
  );
  const currentUserScheduleMemberIdentity = currentUser
    ? getGroupMemberIdentity(createCurrentUserGroupMember(currentUser))
    : null;
  const isGroupMembersLoading =
    isInviteListOpen && isFetchingGroupMembers && !groupMembersResponse;

  useEffect(() => {
    if (!isGroupMembersError) {
      hasShownGroupMembersErrorToastRef.current = false;
      return;
    }

    if (!isInviteListOpen || hasShownGroupMembersErrorToastRef.current) {
      return;
    }

    showErrorToast({
      error: groupMembersError,
      title: TOAST_MESSAGES.GROUP.MEMBER_LIST_FAILURE.title,
      fallbackDescription: TOAST_MESSAGES.GROUP.MEMBER_LIST_FAILURE.description,
    });
    hasShownGroupMembersErrorToastRef.current = true;
  }, [groupMembersError, isGroupMembersError, isInviteListOpen]);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-foreground">
        {"일정 멤버"} <span className="text-primary">{members.length}</span>
      </h3>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {members.map((member) => (
          <ScheduleDetailMemberListItem
            key={member.id}
            member={member}
            canRemove={
              currentUserScheduleMemberIdentity !== null &&
              getScheduleMemberIdentity(member) === currentUserScheduleMemberIdentity
            }
            isRemoving={isLeavingSchedule}
            onRemove={() => void requestLeaveSchedule()}
          />
        ))}
        <Popover open={isInviteListOpen} onOpenChange={setIsInviteListOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="초대 가능한 그룹원 보기"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">
                {"초대 가능한 그룹원"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {availableGroupMembers.length}명
              </p>
            </div>
            <div aria-live="polite">
              {isGroupMembersLoading ? (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  {"그룹원 목록을 불러오는 중입니다."}
                </div>
              ) : isGroupMembersError ? (
                <div className="px-4 py-6">
                  <p className="text-sm font-medium text-foreground">
                    {"초대 가능한 그룹원을 불러오지 못했어요"}
                  </p>
                  <button
                    type="button"
                    onClick={() => void refetchGroupMembers()}
                    className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {"다시 시도"}
                  </button>
                </div>
              ) : availableGroupMembers.length > 0 ? (
                <ScrollArea className="max-h-64">
                  <ul className="space-y-1 p-2">
                    {availableGroupMembers.map((member) => (
                      <li
                        key={member.id}
                        className="rounded-md px-2 py-2"
                      >
                        <MemberCard
                          member={mapGroupMemberToMember(member)}
                          action={
                            <button
                              type="button"
                              disabled={addingMemberId !== null}
                              onClick={() => void requestAddScheduleMember(member.id)}
                              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {addingMemberId === member.id ? "추가 중" : "추가"}
                            </button>
                          }
                          profileImageSize={32}
                        />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  {"현재 초대할 수 있는 그룹원이 없어요."}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
