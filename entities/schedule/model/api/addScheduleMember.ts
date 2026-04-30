import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { AddScheduleMemberRequest } from "./types";

export const addScheduleMember = async (
  travelId: number,
  payload: AddScheduleMemberRequest
): Promise<void> => {
  await api.post(REQUEST_PATHS.TRAVELS.ADD_MEMBER(travelId), payload);
};
