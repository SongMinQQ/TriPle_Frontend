"use client";

import { useState } from "react";
import { getSettlementAccountForm } from "@/features/schedule/detail/model/scheduleDetailState";
import type {
  ScheduleSettlement,
  ScheduleSettlementAccountForm,
} from "@/features/schedule/detail/model/types";
import { ScheduleSettlementAccountDialog } from "@/features/schedule/detail/ui/ScheduleSettlementAccountDialog";

interface ScheduleSettlementAccountChangeButtonProps {
  settlement: Pick<
    ScheduleSettlement,
    "accountNumber" | "bankName" | "accountHolder"
  >;
  onSave: (account: ScheduleSettlementAccountForm) => void;
}

export function ScheduleSettlementAccountChangeButton({
  settlement,
  onSave,
}: ScheduleSettlementAccountChangeButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<ScheduleSettlementAccountForm>(() =>
    getSettlementAccountForm(settlement)
  );

  const handleOpen = () => {
    setEditAccount(getSettlementAccountForm(settlement));
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setEditAccount(getSettlementAccountForm(settlement));
    setIsDialogOpen(false);
  };

  const handleChange = (
    field: keyof ScheduleSettlementAccountForm,
    value: string
  ) => {
    setEditAccount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editAccount);
    setIsDialogOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {"계좌 변경"}
      </button>

      <ScheduleSettlementAccountDialog
        isOpen={isDialogOpen}
        editAccount={editAccount}
        onClose={handleClose}
        onSave={handleSave}
        onChange={handleChange}
      />
    </>
  );
}
