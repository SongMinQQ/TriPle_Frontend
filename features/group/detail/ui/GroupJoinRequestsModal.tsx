"use client";

import { useMemo } from "react";
import type { GroupJoinApplyUserDto } from "@/entities/group/model/api/types";
import type { Member } from "@/entities/group/model/types";
import { useGroupJoinAppliesInfiniteQuery } from "@/entities/group/queries/useGroupJoinAppliesInfiniteQuery";
import { MemberCard } from "@/entities/member/ui/member-card";
import { useGroupJoinApplyManageAction } from "@/features/group/detail/model/useGroupJoinApplyManageAction";
import { Modal } from "@/shared/ui/modal";

interface GroupJoinRequestsModalProps {
  open: boolean;
  onClose: () => void;
  routeGroupId: string;
}

const mapJoinApplyToMember = (joinApply: GroupJoinApplyUserDto): Member => ({
  id: String(joinApply.joinApplyId),
  name: joinApply.nickname,
  avatar: joinApply.profileUrl || undefined,
  bio: joinApply.description || "소개가 없습니다.",
  isLeader: false,
});

export function GroupJoinRequestsModal({
  open,
  onClose,
  routeGroupId,
}: GroupJoinRequestsModalProps) {
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useGroupJoinAppliesInfiniteQuery({
    routeGroupId: open ? routeGroupId : undefined,
    status: "PENDING",
    size: 20,
  });
  const {
    processingJoinApplyId,
    requestApproveJoinApply,
    requestRejectJoinApply,
  } =
    useGroupJoinApplyManageAction(routeGroupId);

  const joinApplies = useMemo(
    () => data?.pages.flatMap((page) => page.users) ?? [],
    [data]
  );

  const handleClose = () => {
    if (processingJoinApplyId !== null) {
      return;
    }

    onClose();
  };

  const handleApprove = async (joinApplyId: number) => {
    await requestApproveJoinApply(joinApplyId);
  };

  const handleReject = async (joinApplyId: number) => {
    await requestRejectJoinApply(joinApplyId);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="가입 신청 관리"
      description="대기 중인 가입 신청 내역을 확인하고 승인할 수 있습니다."
    >
      <div className="mt-5">
        {isPending && joinApplies.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            가입 신청 내역을 불러오는 중입니다.
          </p>
        ) : null}

        {isError ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-muted-foreground">
              가입 신청 내역을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              다시 시도
            </button>
          </div>
        ) : null}

        {!isPending && !isError && joinApplies.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            대기 중인 가입 신청 내역이 없습니다.
          </p>
        ) : null}

        {!isError && joinApplies.length > 0 ? (
          <div className="flex max-h-[360px] flex-col gap-4 overflow-y-auto pr-1">
            {joinApplies.map((joinApply) => (
              <MemberCard
                key={joinApply.joinApplyId}
                member={mapJoinApplyToMember(joinApply)}
                action={
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleReject(joinApply.joinApplyId)}
                      disabled={processingJoinApplyId !== null}
                      className="rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processingJoinApplyId === joinApply.joinApplyId
                        ? "처리 중..."
                        : "거절"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleApprove(joinApply.joinApplyId)}
                      disabled={processingJoinApplyId !== null}
                      className="rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processingJoinApplyId === joinApply.joinApplyId
                        ? "처리 중..."
                        : "승인"}
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        ) : null}

        {!isError && hasNextPage ? (
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage || processingJoinApplyId !== null}
            className="mt-4 w-full rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage ? "불러오는 중..." : "신청 내역 더 보기"}
          </button>
        ) : null}
      </div>
    </Modal>
  );
}
