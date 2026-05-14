"use client";

import { CircleDollarSign, Copy } from "lucide-react";
import type {
  ScheduleSettlement,
  ScheduleSettlementAccountForm,
  SettlementSplitMode,
} from "@/features/schedule/detail/model/types";
import { ScheduleSettlementAccountChangeButton } from "@/features/schedule/detail/ui/ScheduleSettlementAccountChangeButton";
import { ScheduleSettlementMemberList } from "@/features/schedule/detail/ui/ScheduleSettlementMemberList";

const TRANSFER_STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: "정산 진행 중",
  DONE: "정산 완료",
};

const getTransferStatusLabel = (status: string): string =>
  TRANSFER_STATUS_LABELS[status] ?? status;

interface ScheduleSettlementSectionProps {
  settlement: ScheduleSettlement;
  splitMode: SettlementSplitMode;
  isManualEditing: boolean;
  memberAmounts: Record<string, string>;
  onSaveAccount: (account: ScheduleSettlementAccountForm) => void;
  onEqualSplit: () => void;
  onManualToggle: () => void;
  onAmountChange: (memberId: string, value: string) => void;
}

export function ScheduleSettlementSection({
  settlement,
  splitMode,
  isManualEditing,
  memberAmounts,
  onSaveAccount,
  onEqualSplit,
  onManualToggle,
  onAmountChange,
}: ScheduleSettlementSectionProps) {
  const hasAccount =
    Boolean(settlement.accountNumber) ||
    Boolean(settlement.bankName) ||
    Boolean(settlement.accountHolder);

  return (
    <section className="flex flex-col gap-6" aria-label="여행 정산">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">{"계좌번호"}</h3>
          <ScheduleSettlementAccountChangeButton
            settlement={settlement}
            onSave={onSaveAccount}
          />
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
          <span className="flex-1 text-sm font-medium text-foreground">
            {hasAccount
              ? `${settlement.accountNumber} ${settlement.bankName} 예금주: ${settlement.accountHolder}`
              : "등록된 계좌 정보가 없습니다."}
          </span>
          <button
            type="button"
            aria-label="계좌번호 복사"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-sm font-bold text-foreground">
            {"총 금액: "}
            {settlement.totalAmount.toLocaleString()}
            {"원"}
          </h3>
          <button type="button" className="text-xs text-muted-foreground underline">
            {"자세히 보기"}
          </button>
          <button type="button" className="text-xs text-muted-foreground">
            {"결제내역 추가"}
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-muted-foreground"
          >
            {"영수증 스캔하기"}
            <CircleDollarSign className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">{"정산 현황"}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {getTransferStatusLabel(settlement.transferStatus)}
              </span>
            </div>
            <div className="mt-1 flex gap-3">
              <button
                type="button"
                onClick={onEqualSplit}
                className={`text-xs font-medium transition-colors ${
                  splitMode === "equal" && !isManualEditing
                    ? "text-foreground underline"
                    : "text-muted-foreground"
                }`}
              >
                {"N/1 하기"}
              </button>
              <button
                type="button"
                onClick={onManualToggle}
                className={`text-xs font-medium transition-colors ${
                  isManualEditing
                    ? "text-primary underline"
                    : splitMode === "manual"
                      ? "text-foreground underline"
                      : "text-muted-foreground"
                }`}
              >
                {isManualEditing ? "확정하기" : "직접 입력"}
              </button>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full border-2 border-primary px-4 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {"정산 완료"}
          </button>
        </div>

        <ScheduleSettlementMemberList
          members={settlement.members}
          isManualEditing={isManualEditing}
          memberAmounts={memberAmounts}
          onAmountChange={onAmountChange}
        />
      </div>
    </section>
  );
}
