import type {
  GetGroupDetailResponse,
  GetPublicGroupsResponse,
  GroupDetailRecentReviewDto,
  GroupDetailRecentTravelDto,
  PublicGroupListItemDto,
} from "@/shared/api/group/types"
import type { Group, Review, ReviewPhoto, Schedule } from "./mock-data"
import type { GroupSummary, GroupSummaryPage } from "./types"
import {
  calculateInclusiveDayCountFromIsoDates,
  formatIsoDateToDot,
  formatIsoDateToShort,
} from "./date.utils"
import {
  GROUP_REVIEW_TITLE_ELLIPSIS,
  GROUP_REVIEW_TITLE_MAX_LENGTH,
} from "./constants"

export const toGroupSummary = (dto: PublicGroupListItemDto): GroupSummary => ({
  groupId: dto.groupId,
  name: dto.name,
  description: dto.description,
  currentMemberCount: dto.currentMemberCount,
  memberLimit: dto.memberLimit,
  thumbNailUrl: dto.thumbNailUrl,
})

export const toGroupSummaryPage = (
  response: GetPublicGroupsResponse
): GroupSummaryPage => ({
  items: response.items.map(toGroupSummary),
  nextCursor: response.nextCursor,
  hasNext: response.hasNext,
})

const createReviewTitle = (content: string): string => {
  const trimmed = content.trim()
  if (!trimmed) {
    return "Review"
  }

  if (trimmed.length <= GROUP_REVIEW_TITLE_MAX_LENGTH) {
    return trimmed
  }

  const slicedLength = GROUP_REVIEW_TITLE_MAX_LENGTH - GROUP_REVIEW_TITLE_ELLIPSIS.length
  if (slicedLength <= 0) {
    return trimmed.slice(0, GROUP_REVIEW_TITLE_MAX_LENGTH)
  }

  return `${trimmed.slice(0, slicedLength)}${GROUP_REVIEW_TITLE_ELLIPSIS}`
}

const mapRecentTravelToSchedule = (travel: GroupDetailRecentTravelDto): Schedule => ({
  id: String(travel.travelItineraryId),
  title: travel.title,
  startDate: formatIsoDateToDot(travel.startAt),
  endDate: formatIsoDateToDot(travel.endAt),
  memberCount: travel.memberCount,
  dayCount: calculateInclusiveDayCountFromIsoDates(travel.startAt, travel.endAt),
})

const mapRecentReviewToReview = (review: GroupDetailRecentReviewDto): Review => ({
  id: String(review.reviewId),
  title: createReviewTitle(review.content),
  author: review.writerNickname,
  date: formatIsoDateToShort(review.createdAt),
  views: review.view,
  scheduleName: review.travelItineraryName,
  thumbnail: review.imageUrl,
  content: review.content,
  photo: review.imageUrl,
})

const mapRecentPhotoToReviewPhoto = (
  photo: { imageId: number; imageUrl: string },
  index: number
): ReviewPhoto => ({
  id: String(photo.imageId),
  src: photo.imageUrl,
  alt: `Recent photo ${index + 1}`,
})

export const applyGroupDetailToGroup = (
  baseGroup: Group,
  detail: GetGroupDetailResponse
): Group => {
  const members = Array.isArray(detail.users)
    ? detail.users.map((user, index) => ({
        id: String(index + 1),
        name: user.name,
        bio: user.description,
        avatar: user.profileUrl || undefined,
        isLeader: user.isOwner,
      }))
    : baseGroup.members

  const schedules = Array.isArray(detail.recentTravels)
    ? detail.recentTravels.map(mapRecentTravelToSchedule)
    : baseGroup.schedules

  const reviews = Array.isArray(detail.recentReviews)
    ? detail.recentReviews.map(mapRecentReviewToReview)
    : baseGroup.reviews

  const reviewPhotos = Array.isArray(detail.recentPhotos)
    ? detail.recentPhotos.map(mapRecentPhotoToReviewPhoto)
    : baseGroup.reviewPhotos

  return {
    ...baseGroup,
    name: detail.name,
    description: detail.description,
    currentMemberCount: detail.currentMemberCount,
    memberLimit: detail.memberLimit,
    thumbNailUrl: detail.thumbNailUrl,
    image: detail.thumbNailUrl || baseGroup.image,
    role: detail.role ?? baseGroup.role,
    members,
    schedules,
    reviews,
    reviewPhotos,
  }
}
