import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type {
  GetScheduleSettlementResponse,
  UpdateScheduleSettlementRequest,
} from "./types";

export const updateScheduleSettlement = async (
  travelId: number,
  settlement: UpdateScheduleSettlementRequest
): Promise<GetScheduleSettlementResponse> => {
  const { data } = await api.patch<GetScheduleSettlementResponse>(
    REQUEST_PATHS.TRAVELS.TRANSFER(travelId),
    settlement
  );

  return data;
};
