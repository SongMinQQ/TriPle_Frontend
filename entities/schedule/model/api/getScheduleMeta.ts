import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GetScheduleMetaResponse } from "./types";

export const getScheduleMeta = async (
  travelId: number
): Promise<GetScheduleMetaResponse> => {
  const { data } = await api.get<GetScheduleMetaResponse>(
    REQUEST_PATHS.TRAVELS.DETAIL_INFO(travelId)
  );

  return data;
};
