"use client";

import { X } from "lucide-react";
import type { ScheduleSettlementAccountForm } from "@/features/schedule/detail/model/types";

interface ScheduleSettlementAccountDialogProps {
  isOpen: boolean;
  editAccount: ScheduleSettlementAccountForm;
  onClose: () => void;
  onSave: () => void;
  onChange: (
    field: keyof ScheduleSettlementAccountForm,
    value: string
  ) => void;
}

export function ScheduleSettlementAccountDialog({
  isOpen,
  editAccount,
  onClose,
  onSave,
  onChange,
}: ScheduleSettlementAccountDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{"계좌 변경"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-foreground" htmlFor="edit-bank">
              {"은행"}
            </label>
            <input
              id="edit-bank"
              type="text"
              value={editAccount.bankName}
              onChange={(event) => onChange("bankName", event.target.value)}
              placeholder="은행명을 입력하세요"
              className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground" htmlFor="edit-account">
              {"계좌번호"}
            </label>
            <input
              id="edit-account"
              type="text"
              value={editAccount.accountNumber}
              onChange={(event) => onChange("accountNumber", event.target.value)}
              placeholder="계좌번호를 입력하세요"
              className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground" htmlFor="edit-holder">
              {"예금주"}
            </label>
            <input
              id="edit-holder"
              type="text"
              value={editAccount.accountHolder}
              onChange={(event) => onChange("accountHolder", event.target.value)}
              placeholder="예금주를 입력하세요"
              className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border bg-transparent py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {"취소"}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {"저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
