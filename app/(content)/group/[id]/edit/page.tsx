"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGroupMenuQuery } from "@/entities/group/queries/useGroupMenuQuery";
import GroupEditForm from "@/features/group/generate/GroupEditForm";
import { useGroupDetailQuery } from "@/entities/group/queries/useGroupDetailQuery";
import { GroupDetailQueryErrorState } from "@/widgets/group/detail/ui/GroupDetailQueryErrorState";

export default function GroupEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const routeGroupId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { data: group, isError, refetch } = useGroupDetailQuery(routeGroupId);
  const {
    data: groupMenu,
    isError: isMenuError,
    isPending: isMenuPending,
    refetch: refetchMenu,
  } = useGroupMenuQuery(routeGroupId);
  const isOwner = groupMenu?.role?.toUpperCase() === "OWNER";

  useEffect(() => {
    if (!routeGroupId || !groupMenu || isOwner) {
      return;
    }

    router.replace(`/group/${routeGroupId}`);
  }, [groupMenu, isOwner, routeGroupId, router]);

  if (isError || isMenuError) {
    return (
      <GroupDetailQueryErrorState
        onRetry={() => {
          void refetch();
          void refetchMenu();
        }}
      />
    );
  }

  if (!group || !groupMenu || isMenuPending) {
    return null;
  }

  if (!isOwner) {
    return <div className="py-10 text-sm text-muted-foreground">접근 권한을 확인하는 중입니다.</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">그룹 정보 수정</h1>
      <GroupEditForm group={group} />
    </div>
  );
}
