"use client";

import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { approveGroupJoinApply } from "@/entities/group/model/api/approveGroupJoinApply";
import { GROUP_QUERY_KEYS } from "@/entities/group/queries/group.query-keys";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { toast } from "@/shared/hooks/use-toast";
import { showErrorToast } from "@/shared/lib/error-toast";

const isValidGroupId = (groupId: number): boolean =>
  Number.isFinite(groupId) && groupId > 0;

const isValidJoinApplyId = (joinApplyId: number): boolean =>
  Number.isFinite(joinApplyId) && joinApplyId > 0;

export const useGroupJoinApplyManageAction = (routeGroupId: string) => {
  const queryClient = useQueryClient();
  const [processingJoinApplyId, setProcessingJoinApplyId] = useState<number | null>(null);

  const invalidateGroupQueries = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: GROUP_QUERY_KEYS.detail(routeGroupId),
      }),
      queryClient.invalidateQueries({
        queryKey: GROUP_QUERY_KEYS.menu(routeGroupId),
      }),
      queryClient.invalidateQueries({
        queryKey: GROUP_QUERY_KEYS.members(routeGroupId),
      }),
      queryClient.invalidateQueries({
        queryKey: [...GROUP_QUERY_KEYS.all, "join-applies", routeGroupId],
      }),
    ]);
  }, [queryClient, routeGroupId]);

  const requestApproveJoinApply = useCallback(
    async (joinApplyId: number): Promise<boolean> => {
      const groupId = Number(routeGroupId);

      if (
        !isValidGroupId(groupId) ||
        !isValidJoinApplyId(joinApplyId) ||
        processingJoinApplyId !== null
      ) {
        return false;
      }

      try {
        setProcessingJoinApplyId(joinApplyId);
        await approveGroupJoinApply(groupId, joinApplyId);

        toast({
          title: TOAST_MESSAGES.GROUP.JOIN_APPLY_APPROVE_SUCCESS.title,
          description: TOAST_MESSAGES.GROUP.JOIN_APPLY_APPROVE_SUCCESS.description,
        });

        await invalidateGroupQueries();
        return true;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          return false;
        }

        showErrorToast({
          error,
          title: TOAST_MESSAGES.GROUP.JOIN_APPLY_APPROVE_FAILURE.title,
          fallbackDescription: TOAST_MESSAGES.GROUP.JOIN_APPLY_APPROVE_FAILURE.description,
        });
        return false;
      } finally {
        setProcessingJoinApplyId(null);
      }
    },
    [invalidateGroupQueries, processingJoinApplyId, routeGroupId]
  );

  return {
    processingJoinApplyId,
    requestApproveJoinApply,
  };
};
