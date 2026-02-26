import Link from "next/link"
import Image from "next/image"
import { BookOpen, CalendarRange } from "lucide-react"
import type { Group } from "@/entities/group/model/mock-data"
import { GroupDetailEmptyState } from "@/widgets/group/detail/ui/GroupDetailEmptyState"
import { GroupDetailSectionHeader } from "@/widgets/group/detail/ui/GroupDetailSectionHeader"

interface GroupDetailReviewsSectionProps {
  group: Group
}

export function GroupDetailReviewsSection({ group }: GroupDetailReviewsSectionProps) {
  const hasReviews = group.reviews.length > 0

  return (
    <section>
      <GroupDetailSectionHeader
        title="여행 후기"
        count={group.reviews.length}
        href={`/group/${group.id}/reviews`}
      />

      {hasReviews ? (
        <div className="mt-4 flex flex-col divide-y divide-border">
          {group.reviews.slice(0, 3).map((review) => (
            <Link
              key={review.id}
              href={`/group/${group.id}/reviews/${review.id}`}
              className="flex gap-4 py-5 transition-colors hover:bg-muted/40 first:pt-0"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                <Image src={review.thumbnail || "/placeholder.svg"} alt={review.title} fill className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-1 text-base font-bold text-foreground sm:text-lg">
                    {review.title}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarRange className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{review.scheduleName}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {review.author} | 조회 {review.views}
                  </span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <GroupDetailEmptyState
          title="등록된 여행 후기가 없어요"
          description="첫 후기가 작성되면 이곳에서 확인할 수 있어요."
          actionHref={`/group/${group.id}/reviews/create`}
          actionLabel="후기 작성"
          icon={<BookOpen className="h-5 w-5" />}
        />
      )}
    </section>
  )
}
