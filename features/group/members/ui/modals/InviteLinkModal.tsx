"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { showErrorToast } from "@/shared/lib/error-toast";
import { Modal } from "@/shared/ui/modal";

interface InviteLinkModalProps {
  open: boolean;
  onClose: () => void;
  inviteLink: string;
}

const COPIED_RESET_DELAY_MS = 2000;

export function InviteLinkModal({
  open,
  onClose,
  inviteLink,
}: InviteLinkModalProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerIdRef = useRef<number | null>(null);

  const resetCopiedState = useCallback(() => {
    if (resetTimerIdRef.current !== null) {
      window.clearTimeout(resetTimerIdRef.current);
      resetTimerIdRef.current = null;
    }

    setCopied(false);
  }, []);

  const handleCopySuccess = useCallback(() => {
    if (resetTimerIdRef.current !== null) {
      window.clearTimeout(resetTimerIdRef.current);
    }

    setCopied(true);
    resetTimerIdRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimerIdRef.current = null;
    }, COPIED_RESET_DELAY_MS);
  }, []);

  const copyWithExecCommandFallback = (): void => {
    const textarea = document.createElement("textarea");
    textarea.value = inviteLink;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      handleCopySuccess();
    } catch (clipboardError) {
      try {
        copyWithExecCommandFallback();
        handleCopySuccess();
      } catch (fallbackError) {
        showErrorToast({
          error: fallbackError ?? clipboardError,
          title: "초대 링크 복사 실패",
          fallbackDescription: "브라우저 복사 기능을 사용할 수 없습니다.",
        });
      }
    }
  };

  const handleClose = () => {
    resetCopiedState();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      resetCopiedState();
    }
  }, [open, resetCopiedState]);

  useEffect(() => () => resetCopiedState(), [resetCopiedState]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="초대 링크"
      description="아래 링크를 공유해 그룹에 멤버를 초대하세요."
    >
      <div className="mt-5 flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
        <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-sm text-foreground">{inviteLink}</span>
      </div>

      <button
        type="button"
        onClick={() => void handleCopy()}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all ${
          copied
            ? "bg-green-500 text-background"
            : "bg-primary text-primary-foreground hover:opacity-90"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            복사 완료!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            링크 복사하기
          </>
        )}
      </button>
    </Modal>
  );
}
