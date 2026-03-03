import Link from "next/link"
import Image from "next/image"
import { ImagePlus } from "lucide-react"
import type { Group } from "@/entities/group/model/types"
import { GroupDetailEmptyState } from "@/widgets/group/detail/ui/GroupDetailEmptyState"
import { GroupDetailSectionHeader } from "@/widgets/group/detail/ui/GroupDetailSectionHeader"

interface GroupDetailReviewPhotosSectionProps {
  group: Group
}

export function GroupDetailReviewPhotosSection({ group }: GroupDetailReviewPhotosSectionProps) {
  const hasPhotos = group.reviewPhotos.length > 0

  return (
    <section className="hidden lg:block">
      <GroupDetailSectionHeader
        title="여행 후기"
        count={group.reviewPhotos.length}
        href={`/group/${group.id}/reviews`}
      />

      {hasPhotos ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {group.reviewPhotos.slice(0, 4).map((photo) => (
            <Link
              key={photo.id}
              href={`/group/${group.id}/reviews`}
              className="relative block aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </Link>
          ))}
        </div>
      ) : (
        <GroupDetailEmptyState
          title="후기 사진이 없어요"
          description="후기와 함께 올라온 사진이 이곳에 표시돼요."
          icon={<ImagePlus className="h-5 w-5" />}
        />
      )}
    </section>
  )
}
