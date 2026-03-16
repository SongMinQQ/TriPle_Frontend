"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { createSchedule } from "@/entities/schedule/model/api/createSchedule";
import { SCHEDULE_QUERY_KEYS } from "@/entities/schedule/queries/schedule.query-keys";
import { GROUP_QUERY_KEYS } from "@/entities/group/queries/group.query-keys";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { toast } from "@/shared/hooks/use-toast";
import { showErrorToast } from "@/shared/lib/error-toast";

interface RequestScheduleCreateParams {
  title: string;
  startDate: string;
  endDate: string;
  memberUuids: string[];
}

const isValidGroupId = (groupId: number): boolean =>
  Number.isFinite(groupId) && groupId > 0;

const toScheduleDateTime = (date: string): string => `${date}T00:00`;

export const useScheduleCreateAction = (groupId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestCreateSchedule = useCallback(
    async ({
      title,
      startDate,
      endDate,
      memberUuids,
    }: RequestScheduleCreateParams): Promise<boolean> => {
      if (isSubmitting || !isValidGroupId(groupId)) {
        return false;
      }

      const trimmedTitle = title.trim();

      if (!trimmedTitle || !startDate || !endDate || memberUuids.length === 0) {
        toast({
          variant: "destructive",
          title: TOAST_MESSAGES.SCHEDULE.CREATE_VALIDATION.title,
          description: TOAST_MESSAGES.SCHEDULE.CREATE_VALIDATION.description,
        });
        return false;
      }

      setIsSubmitting(true);

      try {
        const response = await createSchedule({
          title: trimmedTitle,
          startAt: toScheduleDateTime(startDate),
          endAt: toScheduleDateTime(endDate),
          groupId,
          description: "",
          memberUuids,
        });

        toast({
          title: TOAST_MESSAGES.SCHEDULE.CREATE_SUCCESS.title,
          description: TOAST_MESSAGES.SCHEDULE.CREATE_SUCCESS.description,
        });

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: SCHEDULE_QUERY_KEYS.all,
          }),
          queryClient.invalidateQueries({
            queryKey: GROUP_QUERY_KEYS.detail(String(groupId)),
          }),
        ]);

        router.push(`/group/${groupId}/schedules/${response.itineraryId}`);
        return true;
      } catch (error) {
        showErrorToast({
          error,
          title: TOAST_MESSAGES.SCHEDULE.CREATE_FAILURE.title,
          fallbackDescription: TOAST_MESSAGES.SCHEDULE.CREATE_FAILURE.description,
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [groupId, isSubmitting, queryClient, router]
  );

  return {
    isSubmitting,
    requestCreateSchedule,
  };
};
