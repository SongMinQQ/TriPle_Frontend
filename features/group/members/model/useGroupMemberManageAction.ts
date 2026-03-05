"use client";

import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { kickGroupMember } from "@/entities/group/model/api/kickGroupMember";
import { transferGroupOwner } from "@/entities/group/model/api/transferGroupOwner";
import { GROUP_QUERY_KEYS } from "@/entities/group/queries/group.query-keys";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { toast } from "@/shared/hooks/use-toast";
import { showErrorToast } from "@/shared/lib/error-toast";

const isValidGroupId = (groupId: number): boolean =>
  Number.isFinite(groupId) && groupId > 0;

const isValidTargetUserId = (targetUserId: string): boolean =>
  typeof targetUserId === "string" && targetUserId.trim().length > 0;

export const useGroupMemberManageAction = (routeGroupId: string) => {
  const queryClient = useQueryClient();
  const [processingMemberId, setProcessingMemberId] = useState<string | null>(null);

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
    ]);
  }, [queryClient, routeGroupId]);

  const requestKickMember = useCallback(
    async (targetUserId: string): Promise<boolean> => {
      const groupId = Number(routeGroupId);

      if (
        !isValidGroupId(groupId) ||
        !isValidTargetUserId(targetUserId) ||
        processingMemberId
      ) {
        return false;
      }

      try {
        setProcessingMemberId(targetUserId);
        await kickGroupMember(groupId, targetUserId);

        toast({
          title: TOAST_MESSAGES.GROUP.MEMBER_KICK_SUCCESS.title,
          description: TOAST_MESSAGES.GROUP.MEMBER_KICK_SUCCESS.description,
        });

        await invalidateGroupQueries();
        return true;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          return false;
        }

        showErrorToast({
          error,
          title: TOAST_MESSAGES.GROUP.MEMBER_KICK_FAILURE.title,
          fallbackDescription: TOAST_MESSAGES.GROUP.MEMBER_KICK_FAILURE.description,
        });
        return false;
      } finally {
        setProcessingMemberId(null);
      }
    },
    [invalidateGroupQueries, processingMemberId, routeGroupId]
  );

  const requestTransferOwner = useCallback(
    async (targetUserId: string): Promise<boolean> => {
      const groupId = Number(routeGroupId);

      if (
        !isValidGroupId(groupId) ||
        !isValidTargetUserId(targetUserId) ||
        processingMemberId
      ) {
        return false;
      }

      try {
        setProcessingMemberId(targetUserId);
        await transferGroupOwner(groupId, targetUserId);

        toast({
          title: TOAST_MESSAGES.GROUP.OWNER_TRANSFER_SUCCESS.title,
          description: TOAST_MESSAGES.GROUP.OWNER_TRANSFER_SUCCESS.description,
        });

        await invalidateGroupQueries();
        return true;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          return false;
        }

        showErrorToast({
          error,
          title: TOAST_MESSAGES.GROUP.OWNER_TRANSFER_FAILURE.title,
          fallbackDescription: TOAST_MESSAGES.GROUP.OWNER_TRANSFER_FAILURE.description,
        });
        return false;
      } finally {
        setProcessingMemberId(null);
      }
    },
    [invalidateGroupQueries, processingMemberId, routeGroupId]
  );

  return {
    processingMemberId,
    requestKickMember,
    requestTransferOwner,
  };
};
