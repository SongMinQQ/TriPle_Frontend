"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { GroupMemberDto } from "@/entities/group/model/api/types";
import type { Member } from "@/entities/group/model/types";
import { useGroupDetailQuery } from "@/entities/group/queries/useGroupDetailQuery";
import { useGroupMembersQuery } from "@/entities/group/queries/useGroupMembersQuery";
import { MemberCard } from "@/entities/member/ui/member-card";
import {
  type MemberActionType,
  type PendingMemberAction,
} from "@/features/group/members/model/memberManageAction";
import { useGroupMemberManageAction } from "@/features/group/members/model/useGroupMemberManageAction";
import { MemberManageActionButtons } from "@/features/group/members/ui/actions/MemberManageActionButtons";
import { InviteLinkModal } from "@/features/group/members/ui/modals/InviteLinkModal";
import { MemberActionConfirmModal } from "@/features/group/members/ui/modals/MemberActionConfirmModal";
import { GroupDetailQueryErrorState } from "@/widgets/group/detail/ui/GroupDetailQueryErrorState";

const mapGroupMemberToMember = (member: GroupMemberDto): Member => ({
  id: member.id,
  name: member.name,
  avatar: member.profileUrl || undefined,
  bio: member.description || "소개가 없습니다.",
  isLeader: member.isOwner,
});

export default function MembersPage() {
  const params = useParams<{ id: string }>();
  const routeGroupId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { data: groupDetail, isError: isDetailError, isPending: isDetailPending, refetch: refetchDetail } =
    useGroupDetailQuery(routeGroupId);
  const { data: groupMembers, isError: isMembersError, isPending: isMembersPending, refetch: refetchMembers } =
    useGroupMembersQuery(routeGroupId);
  const { processingMemberId, requestKickMember, requestTransferOwner } =
    useGroupMemberManageAction(routeGroupId ?? "");

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [pendingMemberAction, setPendingMemberAction] = useState<PendingMemberAction | null>(null);

  const inviteLink = `https://triple.app/invite/${routeGroupId ?? ""}?code=aBcD1234`;
  const members = groupMembers?.users ?? [];
  const isOwner = groupDetail?.role?.toUpperCase() === "OWNER";
  const isLoading = isDetailPending || isMembersPending;
  const isError = isDetailError || isMembersError;
  const isProcessingMemberAction =
    pendingMemberAction !== null && processingMemberId === pendingMemberAction.member.id;

  const mappedMembers = useMemo(
    () => members.map((groupMember) => ({ groupMember, member: mapGroupMemberToMember(groupMember) })),
    [members]
  );

  const handleRetry = () => {
    void refetchDetail();
    void refetchMembers();
  };

  const handleOpenMemberActionModal = (
    actionType: MemberActionType,
    targetMember: GroupMemberDto
  ) => {
    setPendingMemberAction({
      type: actionType,
      member: targetMember,
    });
  };

  const handleCloseMemberActionModal = () => {
    if (isProcessingMemberAction) {
      return;
    }

    setPendingMemberAction(null);
  };

  const handleConfirmMemberAction = async () => {
    if (!pendingMemberAction) {
      return;
    }

    const actionSuccess =
      pendingMemberAction.type === "kick"
        ? await requestKickMember(pendingMemberAction.member.id)
        : await requestTransferOwner(pendingMemberAction.member.id);

    if (actionSuccess) {
      setPendingMemberAction(null);
    }
  };

  if (!routeGroupId) {
    return null;
  }

  if (isError) {
    return <GroupDetailQueryErrorState onRetry={handleRetry} />;
  }

  if (isLoading) {
    return (
      <div className="py-10 text-sm text-muted-foreground">
        멤버 목록을 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">
        멤버 <span className="text-primary">{members.length}</span>
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {mappedMembers.map(({ groupMember, member }) => (
          <MemberCard
            key={groupMember.id}
            member={member}
            action={
              isOwner && !groupMember.isOwner ? (
                <MemberManageActionButtons
                  member={groupMember}
                  disabled={Boolean(processingMemberId)}
                  onTransferOwner={(targetMember) =>
                    handleOpenMemberActionModal("transfer", targetMember)
                  }
                  onKick={(targetMember) => handleOpenMemberActionModal("kick", targetMember)}
                />
              ) : null
            }
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          초대 링크
        </button>
      </div>

      <InviteLinkModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteLink={inviteLink}
      />

      <MemberActionConfirmModal
        pendingAction={pendingMemberAction}
        isProcessing={isProcessingMemberAction}
        onClose={handleCloseMemberActionModal}
        onConfirm={() => void handleConfirmMemberAction()}
      />
    </div>
  );
}
