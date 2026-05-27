"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updateScheduleSettlement } from "@/entities/schedule/model/api/updateScheduleSettlement";
import { mapScheduleSettlementResponse } from "@/entities/schedule/model/mappers";
import type { ScheduleSettlement } from "@/features/schedule/detail/model/types";
import { SCHEDULE_QUERY_KEYS } from "@/entities/schedule/queries/schedule.query-keys";
import { isValidRouteScheduleId } from "@/entities/schedule/queries/schedule.query-utils";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { toast } from "@/shared/hooks/use-toast";
import { showErrorToast } from "@/shared/lib/error-toast";

const toUpdateScheduleSettlementRequest = (
  settlement: ScheduleSettlement
) => ({
  accountNumber: (settlement.accountNumber ?? "").trim(),
  bankName: (settlement.bankName ?? "").trim(),
  accountHolder: (settlement.accountHolder ?? "").trim(),
  totalAmount: settlement.totalAmount,
  members: settlement.members.map((member) => ({
    id: member.id,
    amount: member.amount,
  })),
});

export const useScheduleSettlementUpdateAction = (routeScheduleId: string) => {
  const queryClient = useQueryClient();
  const [isUpdatingSettlement, setIsUpdatingSettlement] = useState(false);

  const requestUpdateScheduleSettlement = useCallback(
    async (
      settlement: ScheduleSettlement
    ): Promise<ScheduleSettlement | null> => {
      if (!isValidRouteScheduleId(routeScheduleId) || isUpdatingSettlement) {
        return null;
      }

      const scheduleId = Number(routeScheduleId);
      setIsUpdatingSettlement(true);

      try {
        const response = await updateScheduleSettlement(
          scheduleId,
          toUpdateScheduleSettlementRequest(settlement)
        );
        const updatedSettlement = mapScheduleSettlementResponse(response);

        queryClient.setQueryData(
          SCHEDULE_QUERY_KEYS.settlement(scheduleId),
          updatedSettlement
        );
        toast({
          title: TOAST_MESSAGES.SCHEDULE.SETTLEMENT_UPDATE_SUCCESS.title,
          description:
            TOAST_MESSAGES.SCHEDULE.SETTLEMENT_UPDATE_SUCCESS.description,
        });

        return updatedSettlement;
      } catch (error) {
        showErrorToast({
          error,
          title: TOAST_MESSAGES.SCHEDULE.SETTLEMENT_UPDATE_FAILURE.title,
          fallbackDescription:
            TOAST_MESSAGES.SCHEDULE.SETTLEMENT_UPDATE_FAILURE.description,
        });
        return null;
      } finally {
        setIsUpdatingSettlement(false);
      }
    },
    [isUpdatingSettlement, queryClient, routeScheduleId]
  );

  return {
    isUpdatingSettlement,
    requestUpdateScheduleSettlement,
  };
};
