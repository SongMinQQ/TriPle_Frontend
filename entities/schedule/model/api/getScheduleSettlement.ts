import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetScheduleSettlementResponse } from "./types";

export const getScheduleSettlement = async (
  travelId: number
): Promise<GetScheduleSettlementResponse> => {
  const { data } = await api.get<GetScheduleSettlementResponse>(
    REQUEST_PATHS.TRAVELS.TRANSFER(travelId)
  );

  return data;
};
