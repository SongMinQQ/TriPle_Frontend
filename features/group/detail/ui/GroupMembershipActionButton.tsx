"use client";

import Link from "next/link";
import type { MouseEventHandler } from "react";
import {
  GROUP_MANAGE_MODAL_ACTIONS,
  isGroupDeleteOption,
  type GroupManageOption,
} from "@/features/group/detail/lib/groupManageModalActions";
import type { GroupMembershipAction } from "@/features/group/detail/lib/groupMembershipAction";
import { GroupDeleteConfirmModal } from "@/features/group/detail/ui/GroupDeleteConfirmModal";
import { GroupManageModal } from "@/features/group/detail/ui/GroupManageModal";
import { useDisclosure } from "@/shared/hooks/use-disclosure";
import { cn } from "@/shared/lib/utils";

interface GroupMembershipActionButtonProps {
  action: GroupMembershipAction;
  href?: string;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onManageOptionSelect?: (option: GroupManageOption) => void;
  onDeleteGroup?: () => Promise<boolean>;
  isDeletingGroup?: boolean;
}

const ACTION_LABEL: Record<GroupMembershipAction, string> = {
  manage: "그룹 관리",
  join: "가입 신청",
  leave: "그룹 나가기",
};

const ACTION_STYLE: Record<GroupMembershipAction, string> = {
  manage: "bg-primary text-primary-foreground hover:opacity-90",
  join: "bg-primary text-primary-foreground hover:opacity-90",
  leave: "bg-destructive text-destructive-foreground hover:opacity-90",
};

export function GroupMembershipActionButton({
  action,
  href,
  className,
  disabled = false,
  onClick,
  onManageOptionSelect,
  onDeleteGroup,
  isDeletingGroup = false,
}: GroupMembershipActionButtonProps) {
  const {
    isOpen: isManageModalOpen,
    open: openManageModal,
    close: closeManageModal,
  } = useDisclosure();

  const {
    isOpen: isDeleteConfirmModalOpen,
    open: openDeleteConfirmModal,
    close: closeDeleteConfirmModal,
  } = useDisclosure();

  const buttonClassName = cn(
    "rounded-full px-5 py-1.5 text-xs font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-60",
    ACTION_STYLE[action],
    disabled && "pointer-events-none opacity-60",
    className
  );

  const handleManageOptionSelect = (option: GroupManageOption) => {
    if (isGroupDeleteOption(option)) {
      closeManageModal();
      openDeleteConfirmModal();
      return;
    }

    onManageOptionSelect?.(option);
    closeManageModal();
  };

  const handleDeleteConfirm = async () => {
    if (!onDeleteGroup) {
      closeDeleteConfirmModal();
      return;
    }

    const isDeleted = await onDeleteGroup();

    if (isDeleted) {
      closeDeleteConfirmModal();
    }
  };

  const handleManageButtonClick: MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    onClick?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    openManageModal();
  };

  if (action === "manage") {
    return (
      <>
        <button
          type="button"
          className={buttonClassName}
          disabled={disabled}
          onClick={handleManageButtonClick}
        >
          {ACTION_LABEL[action]}
        </button>

        <GroupManageModal
          open={isManageModalOpen}
          onClose={closeManageModal}
          onSelect={handleManageOptionSelect}
          buttons={GROUP_MANAGE_MODAL_ACTIONS}
        />

        <GroupDeleteConfirmModal
          open={isDeleteConfirmModalOpen}
          onClose={closeDeleteConfirmModal}
          onConfirm={() => void handleDeleteConfirm()}
          isSubmitting={isDeletingGroup}
        />
      </>
    );
  }

  if (href) {
    return (
      <Link href={href} className={buttonClassName} aria-disabled={disabled}>
        {ACTION_LABEL[action]}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
    >
      {ACTION_LABEL[action]}
    </button>
  );
}
