"use client";

import { Modal } from "@/shared/ui/modal";

interface GroupDeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function GroupDeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  isSubmitting = false,
  title = "그룹을 삭제할까요?",
  description = "삭제한 그룹은 복구할 수 없습니다. 계속 진행하려면 삭제를 눌러주세요.",
  confirmLabel = "삭제",
  cancelLabel = "취소",
}: GroupDeleteConfirmModalProps) {
  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={title} description={description}>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="flex-1 rounded-lg bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "삭제 중..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
