import { REQUEST_PATHS } from "@/shared/constants/paths";
import api from "@/shared/lib/api/client";

export const rejectGroupJoinApply = async (
  groupId: number,
  joinApplyId: number
): Promise<void> => {
  const requestBody = new URLSearchParams();

  await api.post(
    REQUEST_PATHS.GROUPS.REJECT_JOIN_APPLY(groupId, joinApplyId),
    requestBody,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};
