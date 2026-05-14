"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useScheduleSettlementQuery } from "@/entities/schedule/queries/useScheduleSettlementQuery";
import { getSettlementMemberAmounts } from "@/features/schedule/detail/model/scheduleDetailState";
import type {
  ScheduleDetailTab,
  ScheduleSettlement,
  ScheduleSettlementAccountForm,
  SettlementSplitMode,
} from "@/features/schedule/detail/model/types";
import { getRouteParam } from "@/features/schedule/detail/model/scheduleEditorUtils";
import { ScheduleItineraryEditorSection } from "@/features/schedule/detail/ui/ScheduleItineraryEditorSection";
import { ScheduleSettlementSection } from "@/features/schedule/detail/ui/ScheduleSettlementSection";
import { ScheduleSettlementSectionSkeleton } from "@/features/schedule/detail/ui/ScheduleSettlementSectionSkeleton";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { showErrorToast } from "@/shared/lib/error-toast";
import { GroupDetailQueryErrorState } from "@/widgets/group/detail/ui/GroupDetailQueryErrorState";

const getEqualSplitMembers = (
  settlement: ScheduleSettlement
): ScheduleSettlement["members"] => {
  const memberCount = settlement.members.length;
  const perPerson = Math.floor(settlement.totalAmount / memberCount);
  const remainder = settlement.totalAmount - perPerson * memberCount;

  return settlement.members.map((member, index) => ({
    ...member,
    amount: perPerson + (index === 0 ? remainder : 0),
  }));
};

export function ScheduleDetailTabContent() {
  const hasShownSettlementErrorToastRef = useRef(false);
  const isManualEditingRef = useRef(false);
  const appliedSettlementRouteIdRef = useRef<string | null>(null);
  const params = useParams<{ scheduleId: string }>();
  const routeScheduleId = getRouteParam(params?.scheduleId);
  const [activeTab, setActiveTab] = useState<ScheduleDetailTab>("itinerary");
  const [splitMode, setSplitMode] = useState<SettlementSplitMode>("equal");
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [settlement, setSettlement] = useState<ScheduleSettlement | null>(null);
  const [memberAmounts, setMemberAmounts] = useState<Record<string, string>>({});
  const {
    data: fetchedSettlement,
    error: settlementError,
    isError: isSettlementError,
    refetch: refetchSettlement,
  } = useScheduleSettlementQuery(routeScheduleId, activeTab === "settlement");
  const currentSettlement = settlement ?? fetchedSettlement;

  useEffect(() => {
    isManualEditingRef.current = isManualEditing;
  }, [isManualEditing]);

  useEffect(() => {
    if (!isSettlementError) {
      hasShownSettlementErrorToastRef.current = false;
      return;
    }

    if (hasShownSettlementErrorToastRef.current) {
      return;
    }

    showErrorToast({
      error: settlementError,
      title: TOAST_MESSAGES.SCHEDULE.SETTLEMENT_DETAIL_FAILURE.title,
      fallbackDescription:
        TOAST_MESSAGES.SCHEDULE.SETTLEMENT_DETAIL_FAILURE.description,
    });
    hasShownSettlementErrorToastRef.current = true;
  }, [isSettlementError, settlementError]);

  useEffect(() => {
    if (!fetchedSettlement) {
      return;
    }

    const isNewRouteSettlement =
      appliedSettlementRouteIdRef.current !== routeScheduleId;
    if (isManualEditingRef.current && !isNewRouteSettlement) {
      return;
    }

    appliedSettlementRouteIdRef.current = routeScheduleId;
    setSettlement(fetchedSettlement);
    setMemberAmounts(getSettlementMemberAmounts(fetchedSettlement));
    setIsManualEditing(false);
    setSplitMode("equal");
  }, [fetchedSettlement, routeScheduleId]);

  const handleSaveAccount = (account: ScheduleSettlementAccountForm) => {
    if (!currentSettlement) {
      return;
    }

    setSettlement((prev) => ({
      ...(prev ?? currentSettlement),
      accountNumber: account.accountNumber,
      bankName: account.bankName,
      accountHolder: account.accountHolder,
    }));
  };

  const handleAmountChange = (memberId: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setMemberAmounts((prev) => ({ ...prev, [memberId]: numericValue }));
  };

  const handleManualToggle = () => {
    if (!currentSettlement) {
      return;
    }

    if (isManualEditing) {
      const updatedMembers = currentSettlement.members.map((member) => ({
        ...member,
        amount: Number.parseInt(memberAmounts[member.id] || "0", 10),
      }));
      const newTotal = updatedMembers.reduce((sum, member) => sum + member.amount, 0);

      setSettlement((prev) => ({
        ...(prev ?? currentSettlement),
        totalAmount: newTotal,
        members: updatedMembers,
      }));
      setIsManualEditing(false);
      setSplitMode("manual");
      return;
    }

    setIsManualEditing(true);
    setSplitMode("manual");
  };

  const handleEqualSplit = () => {
    if (!currentSettlement || currentSettlement.members.length === 0) {
      return;
    }

    setSplitMode("equal");
    setIsManualEditing(false);

    const updatedMembers = getEqualSplitMembers(currentSettlement);

    setSettlement((prev) => ({
      ...(prev ?? currentSettlement),
      members: updatedMembers,
    }));
    setMemberAmounts(getSettlementMemberAmounts({ members: updatedMembers }));
  };

  return (
    <>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() =>
            setActiveTab((prev) => (prev === "itinerary" ? "settlement" : "itinerary"))
          }
          className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {activeTab === "itinerary" ? "정산 보기" : "일정 작성"}
        </button>
      </div>

      <div className="mt-4">
        <div
          className={activeTab === "itinerary" ? "block" : "hidden"}
          aria-hidden={activeTab !== "itinerary"}
        >
          <ScheduleItineraryEditorSection />
        </div>
        <div
          className={activeTab === "settlement" ? "block" : "hidden"}
          aria-hidden={activeTab !== "settlement"}
        >
          {isSettlementError ? (
            <GroupDetailQueryErrorState
              compact
              onRetry={() => void refetchSettlement()}
              title="정산 정보를 불러오지 못했어요"
              description="잠시 후 다시 시도해 주세요."
            />
          ) : currentSettlement ? (
            <ScheduleSettlementSection
              settlement={currentSettlement}
              splitMode={splitMode}
              isManualEditing={isManualEditing}
              memberAmounts={memberAmounts}
              onSaveAccount={handleSaveAccount}
              onEqualSplit={handleEqualSplit}
              onManualToggle={handleManualToggle}
              onAmountChange={handleAmountChange}
            />
          ) : (
            <ScheduleSettlementSectionSkeleton />
          )}
        </div>
      </div>
    </>
  );
}
