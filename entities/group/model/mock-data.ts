import type { Group, Member, Review, ReviewPhoto, Schedule } from "./types";

export const mockMembers: Member[] = [
  {
    id: "1",
    name: "김민준",
    bio: "여행 계획 세우는 걸 좋아하는 리더입니다.",
    isLeader: true,
  },
  {
    id: "2",
    name: "박서준",
    bio: "맛집 공유를 가장 좋아해요.",
  },
  {
    id: "3",
    name: "이지은",
    bio: "사진 찍는 걸 좋아합니다.",
  },
  {
    id: "4",
    name: "최정우",
    bio: "분위기 메이커 역할을 맡고 있어요.",
  },
  {
    id: "5",
    name: "한지민",
    bio: "식당 리서치를 담당합니다.",
  },
  {
    id: "6",
    name: "윤도현",
    bio: "세부 일정 짜는 걸 잘해요.",
  },
];

export const mockSchedules: Schedule[] = [
  {
    id: "1",
    title: "제주 서쪽 여행",
    startDate: "2025.03.01",
    endDate: "2025.03.05",
    memberCount: 3,
    dayCount: 3,
  },
  {
    id: "2",
    title: "부산 해안 여행",
    startDate: "2025.04.10",
    endDate: "2025.04.13",
    memberCount: 4,
    dayCount: 4,
  },
];

export const mockReviewPhotos: ReviewPhoto[] = [
  {
    id: "1",
    src: "/placeholder.svg?height=200&width=280&query=friends travel beach korea",
    alt: "여행 사진 1",
  },
  {
    id: "2",
    src: "/placeholder.svg?height=200&width=280&query=friends cheers drinks sunset",
    alt: "여행 사진 2",
  },
  {
    id: "3",
    src: "/placeholder.svg?height=200&width=280&query=friends campfire night outdoor",
    alt: "여행 사진 3",
  },
  {
    id: "4",
    src: "/placeholder.svg?height=200&width=280&query=friends beach sunset group",
    alt: "여행 사진 4",
  },
];

export const mockReviews: Review[] = [
  {
    id: "1",
    title: "한라산에서 본 일출",
    author: "김민준",
    date: "26.03.02",
    views: 10,
    scheduleName: "제주 서쪽 여행",
    thumbnail: "/placeholder.svg?height=160&width=160&query=friends hiking mountain summit korea",
    content: "새벽에 올라가서 본 일출이 정말 인상적이었어요.",
    photo: "/placeholder.svg?height=400&width=600&query=friends hiking mountain summit korea group photo",
  },
  {
    id: "2",
    title: "바닷가 마시멜로 타임",
    author: "이지은",
    date: "26.03.02",
    views: 10,
    scheduleName: "제주 서쪽 여행",
    thumbnail: "/placeholder.svg?height=160&width=160&query=friends glamping campfire marshmallow night",
    content: "밤바다 보면서 마시멜로 구워 먹은 시간이 최고였어요.",
    photo: "/placeholder.svg?height=400&width=600&query=friends glamping campfire marshmallow night cozy",
  },
  {
    id: "3",
    title: "숙소 바비큐 파티",
    author: "박서준",
    date: "26.03.02",
    views: 10,
    scheduleName: "제주 서쪽 여행",
    thumbnail: "/placeholder.svg?height=160&width=160&query=friends bbq party accommodation sunset",
    content: "고기 맛도 좋고 분위기도 좋아서 기억에 남아요.",
    photo: "/placeholder.svg?height=400&width=600&query=friends bbq party accommodation sunset celebration",
  },
  {
    id: "4",
    title: "모닥불과 별빛",
    author: "한지민",
    date: "26.03.02",
    views: 10,
    scheduleName: "제주 서쪽 여행",
    thumbnail: "/placeholder.svg?height=160&width=160&query=friends campfire marshmallow roasting outdoor",
    content: "맑은 하늘 아래 별이 선명해서 오래 기억날 것 같아요.",
    photo: "/placeholder.svg?height=400&width=600&query=friends campfire marshmallow roasting outdoor night",
  },
];

export const mockGroup: Group = {
  id: "1",
  groupId: 1,
  groupKind: "PUBLIC",
  name: "즐거운 여행단",
  description: "여행 계획부터 후기 공유까지 함께하는 캐주얼 여행 모임입니다.",
  image: "/trip_group_placeholder.png",
  thumbNailUrl: "/trip_group_placeholder.png",
  currentMemberCount: 6,
  memberLimit: 10,
  role: "GUEST",
  members: mockMembers,
  schedules: mockSchedules,
  reviewPhotos: mockReviewPhotos,
  reviews: mockReviews,
};
