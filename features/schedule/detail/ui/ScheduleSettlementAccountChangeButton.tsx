"use client";

interface ScheduleSettlementAccountChangeButtonProps {
  hasAccount: boolean;
  onClick: () => void;
}

export function ScheduleSettlementAccountChangeButton({
  hasAccount,
  onClick,
}: ScheduleSettlementAccountChangeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      {hasAccount ? "계좌 변경" : "계좌 등록"}
    </button>
  );
}
