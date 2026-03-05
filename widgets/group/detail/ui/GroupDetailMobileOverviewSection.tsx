"use client";

import Image from "next/image";
import { Share2, Users } from "lucide-react";
import { PhotoCarousel } from "@/entities/review/ui/photo-carousel";
import type { Group } from "@/entities/group/model/types";
import {
  getGroupMembershipActionControl,
  getGroupMembershipActionFromRole,
} from "@/features/group/detail/lib/groupMembershipAction";
import { GroupMembershipActionButton } from "@/features/group/detail/ui/GroupMembershipActionButton";
import { useGroupManageOptionAction } from "@/features/group/detail/model/useGroupManageOptionAction";
import { useGroupMembershipAction } from "@/features/group/detail/model/useGroupMembershipAction";
import { GroupJoinRequestsModal } from "@/features/group/detail/ui/GroupJoinRequestsModal";
import { PLACEHOLDERS } from "@/shared/constants/constants";

interface GroupDetailMobileOverviewSectionProps {
  group: Group;
}

export function GroupDetailMobileOverviewSection({
  group,
}: GroupDetailMobileOverviewSectionProps) {
  const membershipAction = getGroupMembershipActionFromRole(group.role);
  const { isJoining, isLeaving, requestJoinGroup, requestLeaveGroup } =
    useGroupMembershipAction(String(group.groupId));
  const {
    handleManageOptionSelect,
    isJoinRequestsModalOpen,
    closeJoinRequestsModal,
    isDeletingGroup,
    requestDeleteGroup,
  } = useGroupManageOptionAction(String(group.groupId));
  const membershipActionControl = getGroupMembershipActionControl({
    action: membershipAction,
    isJoining,
    isLeaving,
    requestJoinGroup,
    requestLeaveGroup,
  });

  return (
    <>
      <div className="-mx-4 -mt-8 lg:hidden">
        <PhotoCarousel photos={group.reviewPhotos} />

        <div className="px-4 pt-5">
          <div className="flex items-start gap-3">
            <Image
              src={group.image || PLACEHOLDERS.GROUP_AVATAR}
              alt={group.name}
              width={64}
              height={64}
              className="shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="truncate text-base font-bold text-foreground">{group.name}</h2>
                <button
                  type="button"
                  aria-label="공유"
                  className="shrink-0 text-muted-foreground"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>
                  {group.currentMemberCount}/{group.memberLimit}
                </span>
              </div>
            </div>
            <GroupMembershipActionButton
              action={membershipAction}
              className="shrink-0 px-4 py-1.5"
              disabled={membershipActionControl.disabled}
              onClick={membershipActionControl.onClick}
              onManageOptionSelect={handleManageOptionSelect}
              onDeleteGroup={requestDeleteGroup}
              isDeletingGroup={isDeletingGroup}
            />
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{group.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              여행 후기 {group.reviews.length} · 여행 일정 {group.schedules.length}
            </p>
          </div>
        </div>
      </div>

      <GroupJoinRequestsModal
        open={isJoinRequestsModalOpen}
        onClose={closeJoinRequestsModal}
        routeGroupId={String(group.groupId)}
      />
    </>
  );
}
