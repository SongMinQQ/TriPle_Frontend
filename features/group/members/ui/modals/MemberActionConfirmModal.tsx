"use client";

import {
  getMemberActionButtonLabel,
  getMemberActionDescription,
  getMemberActionTitle,
  type PendingMemberAction,
} from "@/features/group/members/model/memberManageAction";
import { Modal } from "@/shared/ui/modal";

interface MemberActionConfirmModalProps {
  pendingAction: PendingMemberAction | null;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function MemberActionConfirmModal({
  pendingAction,
  isProcessing,
  onClose,
  onConfirm,
}: MemberActionConfirmModalProps) {
  const actionType = pendingAction?.type ?? "kick";

  return (
    <Modal
      open={Boolean(pendingAction)}
      onClose={onClose}
      title={getMemberActionTitle(actionType)}
      description={
        pendingAction
          ? getMemberActionDescription(actionType, pendingAction.member.name)
          : undefined
      }
    >
      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isProcessing}
          className={`rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
            actionType === "kick" ? "bg-destructive" : "bg-primary"
          }`}
        >
          {isProcessing ? "처리 중..." : getMemberActionButtonLabel(actionType)}
        </button>
      </div>
    </Modal>
  );
}
