import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { CreateScheduleRequest, CreateScheduleResponse } from "./types";

export const createSchedule = async (
  scheduleData: CreateScheduleRequest
): Promise<CreateScheduleResponse> => {
  const { data } = await api.post<CreateScheduleResponse>(
    REQUEST_PATHS.TRAVELS.CREATE,
    scheduleData
  );

  return data;
};
