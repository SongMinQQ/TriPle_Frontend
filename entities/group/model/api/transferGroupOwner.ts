import { REQUEST_PATHS } from "@/shared/constants/paths";
import api from "@/shared/lib/api/client";

export const transferGroupOwner = async (
  groupId: number,
  targetUserId: string
): Promise<void> => {
  const requestBody = new URLSearchParams();

  await api.patch(
    REQUEST_PATHS.GROUPS.TRANSFER_OWNER(groupId, targetUserId),
    requestBody,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};
