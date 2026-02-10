import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Users, Share2, CalendarRange } from "lucide-react"
import { mockGroup } from "@/entities/group/model/mock-data"
import { MemberCard } from "@/entities/member/ui/member-card"
import { ScheduleCard } from "@/entities/schedule/ui/schedule-card"
import { PhotoCarousel } from "@/entities/review/ui/photo-carousel"
import { PLACEHOLDERS } from "@/shared/constants/constants"

export default function GroupHomePage() {
  const group = mockGroup

  return (
    <div className="flex flex-col gap-8">
      {/* Mobile Photo Carousel - only visible on mobile */}
      <div className="lg:hidden -mx-4 -mt-8">
        <PhotoCarousel photos={group.reviewPhotos} />

        {/* Mobile Group Info */}
        <div className="px-4 pt-5">
          <div className="flex items-start gap-3">
            <Image
              src={group.image || PLACEHOLDERS.GROUP_AVATAR}
              alt={group.name}
              width={64}
              height={64}
              className="shrink-0 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground truncate">{group.name}</h2>
                <button type="button" aria-label="공유" className="shrink-0 text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{group.memberCount}/{group.maxMembers}</span>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              {"가입 신청"}
            </button>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{group.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {"여행 후기 "}{group.reviews.length}{"  ·  여행 일정 "}{group.schedules.length}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Travel Reviews Section */}
      <section className="hidden lg:block">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {"여행 후기"}{" "}
            <span className="text-primary">{group.reviews.length}</span>
          </h2>
          <Link
            href={`/group/${group.id}/reviews`}
            className="flex items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {"더보기"}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {group.reviews.slice(0, 4).map((review) => (
            <Link
              key={review.id}
              href={`/group/${group.id}/reviews/${review.id}`}
              className="relative aspect-[4/3] overflow-hidden rounded-xl block"
            >
              <Image
                src={review.thumbnail || "/placeholder.svg"}
                alt={review.title}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Members Section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {"멤버"}{" "}
            <span className="text-primary">{group.memberCount}</span>
          </h2>
          <Link
            href={`/group/${group.id}/members`}
            className="hidden items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:flex"
          >
            {"더보기"}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
          {group.members.slice(0, 2).map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
          {/* Show more on desktop */}
          <div className="hidden lg:contents">
            {group.members.slice(2, 4).map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
        {/* Mobile "더보기" button */}
        <Link
          href={`/group/${group.id}/members`}
          className="mt-4 flex items-center justify-center gap-1 rounded-lg bg-muted py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 lg:hidden"
        >
          {"더보기"}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Schedules Section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {"여행 일정"}{" "}
            <span className="text-primary">{group.schedules.length}</span>
          </h2>
          <Link
            href={`/group/${group.id}/schedules`}
            className="flex items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {"더보기"}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {group.schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} showLockMessage />
          ))}
        </div>
      </section>

      {/* Reviews List Section (same format as reviews page) */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {"여행 후기"}{" "}
            <span className="text-primary">{group.reviews.length}</span>
          </h2>
          <Link
            href={`/group/${group.id}/reviews`}
            className="flex items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {"더보기"}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 flex flex-col divide-y divide-border">
          {group.reviews.slice(0, 3).map((review) => (
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
      </section>
    </div>
  )
}
