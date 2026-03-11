import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type {
  GetGroupSchedulesParams,
  GetGroupSchedulesResponse,
} from "./types";

export const getGroupSchedules = async ({
  groupId,
  size = 10,
  cursor,
}: GetGroupSchedulesParams): Promise<GetGroupSchedulesResponse> => {
  const { data } = await api.get<GetGroupSchedulesResponse>(
    REQUEST_PATHS.TRAVELS.LIST(groupId),
    {
      params: {
        ...(typeof cursor === "number" ? { cursor } : {}),
        size,
      },
    }
  );

  return data;
};
