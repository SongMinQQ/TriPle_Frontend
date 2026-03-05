"use client";

import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteGroup } from "@/entities/group/model/api/deleteGroup";
import { GROUP_QUERY_KEYS } from "@/entities/group/queries/group.query-keys";
import type { GroupManageOption } from "@/features/group/detail/lib/groupManageModalActions";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { toast } from "@/shared/hooks/use-toast";
import { showErrorToast } from "@/shared/lib/error-toast";

const isValidGroupId = (groupId: number): boolean =>
  Number.isFinite(groupId) && groupId > 0;

export const useGroupManageOptionAction = (routeGroupId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeletingGroup, setIsDeletingGroup] = useState(false);
  const [isJoinRequestsModalOpen, setIsJoinRequestsModalOpen] = useState(false);

  const handleManageOptionSelect = useCallback(
    (option: GroupManageOption) => {
      if (option === "edit-group-info") {
        router.push(`/group/${routeGroupId}/edit`);
        return;
      }

      if (option === "manage-join-requests") {
        setIsJoinRequestsModalOpen(true);
      }
    },
    [routeGroupId, router]
  );

  const closeJoinRequestsModal = useCallback(() => {
    setIsJoinRequestsModalOpen(false);
  }, []);

  const requestDeleteGroup = useCallback(async (): Promise<boolean> => {
    const groupId = Number(routeGroupId);

    if (!isValidGroupId(groupId) || isDeletingGroup) {
      return false;
    }

    try {
      setIsDeletingGroup(true);
      await deleteGroup(groupId);

      toast({
        title: TOAST_MESSAGES.GROUP.DELETE_SUCCESS.title,
        description: TOAST_MESSAGES.GROUP.DELETE_SUCCESS.description,
      });

      router.replace("/");

      void queryClient.invalidateQueries({
        queryKey: GROUP_QUERY_KEYS.all,
        refetchType: "none",
      });

      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        return false;
      }

      showErrorToast({
        error,
        title: TOAST_MESSAGES.GROUP.DELETE_FAILURE.title,
        fallbackDescription: TOAST_MESSAGES.GROUP.DELETE_FAILURE.description,
      });
      return false;
    } finally {
      setIsDeletingGroup(false);
    }
  }, [isDeletingGroup, queryClient, routeGroupId, router]);

  return {
    handleManageOptionSelect,
    isJoinRequestsModalOpen,
    closeJoinRequestsModal,
    isDeletingGroup,
    requestDeleteGroup,
  };
};
