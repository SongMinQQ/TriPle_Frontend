import { mockMembers } from "@/entities/group/model/mock-data";
import type {
  ScheduleSettlement,
  ScheduleSettlementAccountForm,
} from "@/features/schedule/detail/model/types";

export const initialScheduleMarkdownContent =
  "## 1일차\n\n- 비행기 탑승\n- 렌터카 픽업\n- 숙소\n- 동문시장 탐방\n";

export const initialSettlement: ScheduleSettlement = {
  accountNumber: "999999-00-999999",
  bankName: "KB국민",
  accountHolder: "김민준",
  totalAmount: 180000,
  members: [
    {
      id: "1",
      name: "김민준",
      avatar: mockMembers[0].avatar,
      amount: 180000,
      settled: false,
    },
    {
      id: "2",
      name: "박서준",
      avatar: mockMembers[1].avatar,
      amount: 0,
      settled: true,
    },
  ],
};

export const getSettlementMemberAmounts = (
  settlement: Pick<ScheduleSettlement, "members">
): Record<string, string> =>
  Object.fromEntries(
    settlement.members.map((member) => [member.id, member.amount.toString()])
  );

export const getSettlementAccountForm = (
  settlement: Pick<
    ScheduleSettlement,
    "accountNumber" | "bankName" | "accountHolder"
  >
): ScheduleSettlementAccountForm => ({
  accountNumber: settlement.accountNumber,
  bankName: settlement.bankName,
  accountHolder: settlement.accountHolder,
});
