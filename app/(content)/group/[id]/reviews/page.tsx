import Link from "next/link"
import Image from "next/image"
import { CalendarRange } from "lucide-react"
import { mockGroup } from "@/entities/group/model/mock-data"

export default async function ReviewsPage() {
  const group = mockGroup

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">
        {"여행 후기"}{" "}
        <span className="text-primary">{group.reviews.length}</span>
      </h1>

      <div className="mt-6 flex flex-col divide-y divide-border">
        {group.reviews.map((review) => (
          <Link
            key={review.id}
            href={`/group/${group.id}/reviews/${review.id}`}
            className="flex gap-4 py-5 transition-colors hover:bg-muted/40 first:pt-0"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
              <Image
                src={review.thumbnail || "/placeholder.svg"}
                alt={review.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground line-clamp-1 sm:text-lg">
                  {review.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarRange className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{review.scheduleName}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {review.author} | {"조회 "}{review.views}
                </span>
                <span className="text-xs text-muted-foreground">
                  {review.date}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          href={`/group/${group.id}/reviews/create`}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {"후기 작성"}
        </Link>
      </div>
    </div>
  )
}
