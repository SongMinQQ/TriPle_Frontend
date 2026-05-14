export type ScheduleTransferStatus = "IN_PROGRESS" | "DONE" | (string & {});

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
  transferStatus: ScheduleTransferStatus;
  members: ScheduleSettlementMember[];
}

export interface ScheduleSettlementAccountForm {
  accountNumber: string;
  bankName: string;
  accountHolder: string;
}
