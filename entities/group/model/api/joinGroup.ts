import { REQUEST_PATHS } from "@/shared/constants/paths";
import api from "@/shared/lib/api/client";

/**
 *
 * @param groupId 그룹 ID
 * @returns
 */
export const joinGroup = async (groupId: number) => {
  const requestBody = new URLSearchParams();

  const { data } = await api.post(REQUEST_PATHS.GROUPS.JOIN(groupId), requestBody, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return data;
};
