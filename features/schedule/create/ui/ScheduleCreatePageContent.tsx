"use client";

import { useMemo } from "react";
import type { GroupMemberDto } from "@/entities/group/model/api/types";
import type { UserProfile } from "@/entities/user/model/types";
import { useGroupMembersQuery } from "@/entities/group/queries/useGroupMembersQuery";
import { useMyProfileQuery } from "@/entities/user/queries/useMyProfileQuery";
import {
  findCurrentUserScheduleMember,
  mergeScheduleCreateMembers,
} from "@/features/schedule/create/model/scheduleCreateMembers";
import { ScheduleCreateForm } from "@/features/schedule/create/ui/ScheduleCreateForm";

interface ScheduleCreatePageContentProps {
  groupId: number;
}

const getRequiredMemberId = (
  members: GroupMemberDto[],
  currentUser: UserProfile | undefined
): string | null => {
  const currentUserMember = findCurrentUserScheduleMember(members, currentUser);

  if (currentUserMember) {
    return currentUserMember.id;
  }

  return members.length === 1 ? members[0].id : null;
};

export function ScheduleCreatePageContent({
  groupId,
}: ScheduleCreatePageContentProps) {
  const routeGroupId = String(groupId);
  const {
    data: groupMembers,
    isPending: isMembersPending,
    isError: isMembersError,
    refetch: refetchMembers,
  } = useGroupMembersQuery(routeGroupId);
  const {
    data: currentUser,
    isPending: isUserPending,
    isError: isUserError,
    refetch: refetchCurrentUser,
  } = useMyProfileQuery();

  const members = useMemo(() => {
    return mergeScheduleCreateMembers({
      fetchedMembers: groupMembers?.users ?? [],
      currentUser,
    });
  }, [currentUser, groupMembers?.users]);

  const requiredMemberId = useMemo(
    () => getRequiredMemberId(members, currentUser),
    [currentUser, members]
  );

  const isPending = isMembersPending || isUserPending;
  const isError = isMembersError || isUserError;

  if (isPending) {
    return (
      <div className="py-10 text-sm text-muted-foreground">
        일정 생성에 필요한 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10">
        <p className="text-sm text-muted-foreground">
          일정 생성에 필요한 정보를 불러오지 못했습니다.
        </p>
        <button
          type="button"
          onClick={() => {
            void refetchMembers();
            void refetchCurrentUser();
          }}
          className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <ScheduleCreateForm
      groupId={groupId}
      members={members}
      requiredMemberId={requiredMemberId}
    />
  );
}
