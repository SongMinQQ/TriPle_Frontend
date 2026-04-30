"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { addScheduleMember } from "@/entities/schedule/model/api/addScheduleMember";
import { leaveSchedule } from "@/entities/schedule/model/api/leaveSchedule";
import { SCHEDULE_QUERY_KEYS } from "@/entities/schedule/queries/schedule.query-keys";
import { GROUP_QUERY_KEYS } from "@/entities/group/queries/group.query-keys";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { toast } from "@/shared/hooks/use-toast";
import { showErrorToast } from "@/shared/lib/error-toast";

const isValidRouteId = (routeId: string): boolean => {
  const numericId = Number(routeId);
  return Number.isFinite(numericId) && numericId > 0;
};

const isValidUserUuid = (userUuid: string): boolean => userUuid.trim().length > 0;

export const useScheduleMemberManageAction = ({
  routeGroupId,
  routeScheduleId,
}: {
  routeGroupId: string;
  routeScheduleId: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);
  const [isLeavingSchedule, setIsLeavingSchedule] = useState(false);

  const invalidateScheduleQueries = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: SCHEDULE_QUERY_KEYS.detailMeta(Number(routeScheduleId)),
      }),
      queryClient.invalidateQueries({
        queryKey: SCHEDULE_QUERY_KEYS.all,
      }),
      queryClient.invalidateQueries({
        queryKey: GROUP_QUERY_KEYS.detail(routeGroupId),
      }),
    ]);
  }, [queryClient, routeGroupId, routeScheduleId]);

  const requestAddScheduleMember = useCallback(
    async (userUuid: string): Promise<boolean> => {
      if (
        !isValidRouteId(routeScheduleId) ||
        !isValidUserUuid(userUuid) ||
        addingMemberId !== null
      ) {
        return false;
      }

      setAddingMemberId(userUuid);

      try {
        await addScheduleMember(Number(routeScheduleId), {
          userUuid,
        });

        toast({
          title: TOAST_MESSAGES.SCHEDULE.MEMBER_ADD_SUCCESS.title,
          description: TOAST_MESSAGES.SCHEDULE.MEMBER_ADD_SUCCESS.description,
        });

        await invalidateScheduleQueries();
        return true;
      } catch (error) {
        showErrorToast({
          error,
          title: TOAST_MESSAGES.SCHEDULE.MEMBER_ADD_FAILURE.title,
          fallbackDescription: TOAST_MESSAGES.SCHEDULE.MEMBER_ADD_FAILURE.description,
        });
        return false;
      } finally {
        setAddingMemberId(null);
      }
    },
    [addingMemberId, invalidateScheduleQueries, routeScheduleId]
  );

  const requestLeaveSchedule = useCallback(async (): Promise<boolean> => {
    if (
      !isValidRouteId(routeGroupId) ||
      !isValidRouteId(routeScheduleId) ||
      isLeavingSchedule
    ) {
      return false;
    }

    setIsLeavingSchedule(true);

    try {
      await leaveSchedule(Number(routeScheduleId));

      toast({
        title: TOAST_MESSAGES.SCHEDULE.LEAVE_SUCCESS.title,
        description: TOAST_MESSAGES.SCHEDULE.LEAVE_SUCCESS.description,
      });

      await invalidateScheduleQueries();
      router.push(`/group/${routeGroupId}/schedules`);
      return true;
    } catch (error) {
      showErrorToast({
        error,
        title: TOAST_MESSAGES.SCHEDULE.LEAVE_FAILURE.title,
        fallbackDescription: TOAST_MESSAGES.SCHEDULE.LEAVE_FAILURE.description,
      });
      return false;
    } finally {
      setIsLeavingSchedule(false);
    }
  }, [
    invalidateScheduleQueries,
    isLeavingSchedule,
    routeGroupId,
    routeScheduleId,
    router,
  ]);

  return {
    addingMemberId,
    isLeavingSchedule,
    requestAddScheduleMember,
    requestLeaveSchedule,
  };
};
