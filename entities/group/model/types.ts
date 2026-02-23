export interface GroupSummary {
  groupId: number;
  name: string;
  description: string;
  currentMemberCount: number;
  memberLimit: number;
  thumbNailUrl: string;
}

export interface GroupSummaryPage {
  items: GroupSummary[];
  nextCursor: number | null;
  hasNext: boolean;
}
