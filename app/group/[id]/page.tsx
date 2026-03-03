"use client"

import { useParams } from "next/navigation"
import { useGroupDetailQuery } from "@/entities/group/queries/group.queries"
import { GroupDetailReviewPhotosSection } from "@/widgets/group/detail/ui/GroupDetailReviewPhotosSection"
import { GroupDetailMembersSection } from "@/widgets/group/detail/ui/GroupDetailMembersSection"
import { GroupDetailSchedulesSection } from "@/widgets/group/detail/ui/GroupDetailSchedulesSection"
import { GroupDetailReviewsSection } from "@/widgets/group/detail/ui/GroupDetailReviewsSection"
import { GroupDetailQueryErrorState } from "@/widgets/group/detail/ui/GroupDetailQueryErrorState"
import { GroupDetailMobileOverviewSection } from "@/widgets/group/detail/ui/GroupDetailMobileOverviewSection"

export default function GroupHomePage() {
  const params = useParams<{ id: string }>()
  const routeGroupId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const { data: group, isError, refetch } = useGroupDetailQuery(routeGroupId)

  if (isError) {
    return <GroupDetailQueryErrorState onRetry={() => void refetch()} />
  }

  if (!group) {
    return null
  }

  return (
    <div className="flex flex-col gap-8">
      <GroupDetailMobileOverviewSection group={group} />

      <GroupDetailReviewPhotosSection group={group} />
      <GroupDetailMembersSection group={group} />
      <GroupDetailSchedulesSection group={group} />
      <GroupDetailReviewsSection group={group} />
    </div>
  )
}
