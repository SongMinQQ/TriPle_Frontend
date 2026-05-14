import { mockMembers } from "@/entities/group/model/mock-data";
import type {
  ScheduleSettlement,
  ScheduleSettlementAccountForm,
} from "@/features/schedule/detail/model/types";

export const initialSettlement: ScheduleSettlement = {
  accountNumber: "999999-00-999999",
  bankName: "KB국민",
  accountHolder: "김민준",
  totalAmount: 180000,
  transferStatus: "IN_PROGRESS",
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
