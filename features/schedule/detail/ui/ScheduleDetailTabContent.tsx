"use client";

import { useState } from "react";
import {
  getSettlementMemberAmounts,
  initialSettlement,
} from "@/features/schedule/detail/model/scheduleDetailState";
import type {
  ScheduleDetailTab,
  ScheduleSettlement,
  ScheduleSettlementAccountForm,
  SettlementSplitMode,
} from "@/features/schedule/detail/model/types";
import { ScheduleItineraryEditorSection } from "@/features/schedule/detail/ui/ScheduleItineraryEditorSection";
import { ScheduleSettlementSection } from "@/features/schedule/detail/ui/ScheduleSettlementSection";

export function ScheduleDetailTabContent() {
  const [activeTab, setActiveTab] = useState<ScheduleDetailTab>("itinerary");
  const [splitMode, setSplitMode] = useState<SettlementSplitMode>("equal");
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [settlement, setSettlement] = useState<ScheduleSettlement>(initialSettlement);
  const [memberAmounts, setMemberAmounts] = useState<Record<string, string>>(() =>
    getSettlementMemberAmounts(initialSettlement)
  );

  const handleSaveAccount = (account: ScheduleSettlementAccountForm) => {
    setSettlement((prev) => ({
      ...prev,
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
    if (isManualEditing) {
      const updatedMembers = settlement.members.map((member) => ({
        ...member,
        amount: Number.parseInt(memberAmounts[member.id] || "0", 10),
      }));
      const newTotal = updatedMembers.reduce((sum, member) => sum + member.amount, 0);

      setSettlement((prev) => ({
        ...prev,
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
    setSplitMode("equal");
    setIsManualEditing(false);

    const perPerson = Math.floor(settlement.totalAmount / settlement.members.length);
    const updatedMembers = settlement.members.map((member) => ({
      ...member,
      amount: perPerson,
    }));

    setSettlement((prev) => ({
      ...prev,
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
        {activeTab === "itinerary" ? (
          <ScheduleItineraryEditorSection />
        ) : (
          <ScheduleSettlementSection
            settlement={settlement}
            splitMode={splitMode}
            isManualEditing={isManualEditing}
            memberAmounts={memberAmounts}
            onSaveAccount={handleSaveAccount}
            onEqualSplit={handleEqualSplit}
            onManualToggle={handleManualToggle}
            onAmountChange={handleAmountChange}
          />
        )}
      </div>
    </>
  );
}
