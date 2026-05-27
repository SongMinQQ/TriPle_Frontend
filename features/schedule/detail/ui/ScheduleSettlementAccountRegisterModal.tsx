"use client";

import { useEffect, useState } from "react";
import { getSettlementAccountForm } from "@/features/schedule/detail/model/scheduleDetailState";
import type {
  ScheduleSettlement,
  ScheduleSettlementAccountForm,
} from "@/features/schedule/detail/model/types";
import { Modal } from "@/shared/ui/modal";

interface ScheduleSettlementAccountRegisterModalProps {
  open: boolean;
  settlement: Pick<
    ScheduleSettlement,
    "accountNumber" | "bankName" | "accountHolder"
  >;
  isSaving: boolean;
  onClose: () => void;
  onSave: (account: ScheduleSettlementAccountForm) => Promise<boolean>;
}

export function ScheduleSettlementAccountRegisterModal({
  open,
  settlement,
  isSaving,
  onClose,
  onSave,
}: ScheduleSettlementAccountRegisterModalProps) {
  const [accountForm, setAccountForm] = useState<ScheduleSettlementAccountForm>(
    () => getSettlementAccountForm(settlement)
  );
  const hasAccount =
    Boolean(settlement.accountNumber) ||
    Boolean(settlement.bankName) ||
    Boolean(settlement.accountHolder);
  const modalTitle = hasAccount ? "계좌 변경" : "계좌 등록";

  useEffect(() => {
    if (!open) {
      return;
    }

    setAccountForm(getSettlementAccountForm(settlement));
  }, [
    open,
    settlement.accountHolder,
    settlement.accountNumber,
    settlement.bankName,
  ]);

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    setAccountForm(getSettlementAccountForm(settlement));
    onClose();
  };

  const handleChange = (
    field: keyof ScheduleSettlementAccountForm,
    value: string
  ) => {
    setAccountForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const isSaved = await onSave(accountForm);

    if (isSaved) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={modalTitle}
      closeLabel={`${modalTitle} 모달 닫기`}
    >
      <div className="mt-6 flex flex-col gap-5">
        <div>
          <label
            className="text-sm font-semibold text-foreground"
            htmlFor="settlement-account-bank"
          >
            {"은행"}
          </label>
          <input
            id="settlement-account-bank"
            type="text"
            value={accountForm.bankName}
            disabled={isSaving}
            onChange={(event) => handleChange("bankName", event.target.value)}
            placeholder="은행명을 입력하세요"
            className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        <div>
          <label
            className="text-sm font-semibold text-foreground"
            htmlFor="settlement-account-number"
          >
            {"계좌번호"}
          </label>
          <input
            id="settlement-account-number"
            type="text"
            value={accountForm.accountNumber}
            disabled={isSaving}
            onChange={(event) =>
              handleChange("accountNumber", event.target.value)
            }
            placeholder="계좌번호를 입력하세요"
            className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        <div>
          <label
            className="text-sm font-semibold text-foreground"
            htmlFor="settlement-account-holder"
          >
            {"예금주"}
          </label>
          <input
            id="settlement-account-holder"
            type="text"
            value={accountForm.accountHolder}
            disabled={isSaving}
            onChange={(event) =>
              handleChange("accountHolder", event.target.value)
            }
            placeholder="예금주를 입력하세요"
            className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSaving}
          className="flex-1 rounded-full border border-border bg-transparent py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {"취소"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "저장 중" : "저장"}
        </button>
      </div>
    </Modal>
  );
}
