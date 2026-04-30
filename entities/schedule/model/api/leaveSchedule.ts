import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";

export const leaveSchedule = async (travelId: number): Promise<void> => {
  await api.delete(REQUEST_PATHS.TRAVELS.LEAVE(travelId));
};
