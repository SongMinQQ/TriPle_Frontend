export type ScheduleDetailTab = "itinerary" | "settlement";

export type SettlementSplitMode = "equal" | "manual";

export interface ScheduleSettlementMember {
  id: string;
  name: string;
  avatar?: string;
  amount: number;
  settled: boolean;
}

export interface ScheduleSettlement {
  accountNumber: string;
  bankName: string;
  accountHolder: string;
  totalAmount: number;
  members: ScheduleSettlementMember[];
}

export interface ScheduleSettlementAccountForm {
  accountNumber: string;
  bankName: string;
  accountHolder: string;
}
