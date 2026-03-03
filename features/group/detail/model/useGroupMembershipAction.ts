"use client";

import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { joinGroup } from "@/entities/group/model/api/joinGroup";
import { leaveGroup } from "@/entities/group/model/api/leaveGroup";
import { GROUP_QUERY_KEYS } from "@/entities/group/queries/group.queries";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { toast } from "@/shared/hooks/use-toast";

const isValidGroupId = (groupId: number): boolean =>
  Number.isFinite(groupId) && groupId > 0;

const getErrorMessage = (data: unknown): string | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  return typeof record.message === "string" ? record.message : null;
};

/**
 * 그룹 상세 화면의 멤버십 액션(가입 신청/탈퇴)을 처리하는 커스텀 훅.
 *
 * @param routeGroupId 현재 그룹 라우트 ID
 * @returns 멤버십 액션 로딩 상태와 실행 함수
 */
export const useGroupMembershipAction = (routeGroupId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const isSubmitting = isJoining || isLeaving;

  const invalidateGroupQueries = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: GROUP_QUERY_KEYS.menu(routeGroupId),
      }),
      queryClient.invalidateQueries({
        queryKey: GROUP_QUERY_KEYS.detail(routeGroupId),
      }),
    ]);
  }, [queryClient, routeGroupId]);

  const requestJoinGroup = useCallback(async () => {
    const groupId = Number(routeGroupId);

    if (!isValidGroupId(groupId) || isSubmitting) {
      return;
    }

    try {
      setIsJoining(true);
      await joinGroup(groupId);

      toast({
        title: TOAST_MESSAGES.GROUP_JOIN_REQUEST_SUCCESS.title,
        description: TOAST_MESSAGES.GROUP_JOIN_REQUEST_SUCCESS.description,
      });

      await invalidateGroupQueries();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          return;
        }

        if (error.response?.status === 409) {
          toast({
            title: "가입 신청 안내",
            description: getErrorMessage(error.response.data) ?? "이미 가입이 요청된 그룹입니다.",
          });
          return;
        }
      }

      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.GROUP_JOIN_REQUEST_FAILURE.title,
        description: TOAST_MESSAGES.GROUP_JOIN_REQUEST_FAILURE.description,
      });
    } finally {
      setIsJoining(false);
    }
  }, [invalidateGroupQueries, isSubmitting, routeGroupId]);

  const requestLeaveGroup = useCallback(async () => {
    const groupId = Number(routeGroupId);

    if (!isValidGroupId(groupId) || isSubmitting) {
      return;
    }

    try {
      setIsLeaving(true);
      await leaveGroup(groupId);

      toast({
        title: TOAST_MESSAGES.GROUP_LEAVE_SUCCESS.title,
        description: TOAST_MESSAGES.GROUP_LEAVE_SUCCESS.description,
      });

      await invalidateGroupQueries();
      router.replace("/");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        return;
      }

      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.GROUP_LEAVE_FAILURE.title,
        description: getErrorMessage(
          isAxiosError(error) ? error.response?.data : undefined
        ) ?? TOAST_MESSAGES.GROUP_LEAVE_FAILURE.description,
      });
    } finally {
      setIsLeaving(false);
    }
  }, [invalidateGroupQueries, isSubmitting, routeGroupId, router]);

  return {
    isJoining,
    isLeaving,
    requestJoinGroup,
    requestLeaveGroup,
  };
};
