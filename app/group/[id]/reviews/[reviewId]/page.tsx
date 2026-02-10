import Link from "next/link"
import Image from "next/image"
import { CalendarRange } from "lucide-react"
import { mockGroup } from "@/entities/group/model/mock-data"

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string; reviewId: string }>
}) {
  const { id, reviewId } = await params
  const group = mockGroup
  const review = group.reviews.find((r) => r.id === reviewId) ?? group.reviews[0]

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{review.title}</h1>

      <p className="mt-1 text-sm font-medium text-foreground">{review.author}</p>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{"조회 "}{review.views}</span>
        <span>{review.date}</span>
        <span className="flex items-center gap-1">
          <CalendarRange className="h-3.5 w-3.5" />
          {review.scheduleName}
        </span>
      </div>

      <div className="mt-5 border-t border-border" />

      <div className="mt-6 flex justify-center">
        <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-xl">
          <Image
            src={review.photo || "/placeholder.svg"}
            alt={review.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-foreground">{review.content}</p>

      <div className="mt-12 flex justify-center">
        <Link
          href={`/group/${id}/reviews`}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {"후기 목록"}
        </Link>
      </div>
    </div>
  )
}
