export interface Member {
  id: string
  name: string
  avatar?: string
  bio: string
  isLeader?: boolean
}

export interface Schedule {
  id: string
  title: string
  startDate: string
  endDate: string
  memberCount: number
  dayCount: number
}

export interface ReviewPhoto {
  id: string
  src: string
  alt: string
}

export interface Review {
  id: string
  title: string
  author: string
  date: string
  views: number
  scheduleName: string
  thumbnail: string
  content: string
  photo: string
}

export interface Group {
  id: string
  groupId: number
  name: string
  description: string
  image?: string
  thumbNailUrl: string
  memberCount: number
  currentMemberCount: number
  maxMembers: number
  memberLimit: number
  members: Member[]
  schedules: Schedule[]
  reviewPhotos: ReviewPhoto[]
  reviews: Review[]
}

export const mockMembers: Member[] = [
  {
    id: "1",
    name: "김민준",
    // avatar: "/placeholder.svg?height=48&width=48&query=korean man handsome portrait",
    bio: "여행을 좋아하는 리더입니다.",
    isLeader: true,
  },
  {
    id: "2",
    name: "박서준",
    // avatar: "/placeholder.svg?height=48&width=48&query=korean man casual portrait",
    bio: "함께하면 즐거운 여행 메이트.",
  },
  {
    id: "3",
    name: "이지은",
    // avatar: "/placeholder.svg?height=48&width=48&query=korean woman singer portrait",
    bio: "사진 찍기를 좋아해요.",
  },
  {
    id: "4",
    name: "최정우",
    // avatar: "/placeholder.svg?height=48&width=48&query=korean man funny portrait",
    bio: "분위기 메이커입니다.",
  },
  {
    id: "5",
    name: "한지민",
    // avatar: "/placeholder.svg?height=48&width=48&query=korean woman portrait smiling",
    bio: "맛집 탐방 담당입니다.",
  },
  {
    id: "6",
    name: "윤도현",
    // avatar: "/placeholder.svg?height=48&width=48&query=korean man portrait glasses",
    bio: "계획을 꼼꼼히 세워요.",
  },
]

export const mockSchedules: Schedule[] = [
  {
    id: "1",
    title: "제주도 서쪽 여행",
    startDate: "2025.03.01",
    endDate: "2025.03.05",
    memberCount: 3,
    dayCount: 3,
  },
  {
    id: "2",
    title: "부산 바다 여행",
    startDate: "2025.04.10",
    endDate: "2025.04.13",
    memberCount: 4,
    dayCount: 4,
  },
]

export const mockReviewPhotos: ReviewPhoto[] = [
  { id: "1", src: "/placeholder.svg?height=200&width=280&query=friends travel beach korea", alt: "여행 사진 1" },
  { id: "2", src: "/placeholder.svg?height=200&width=280&query=friends cheers drinks sunset", alt: "여행 사진 2" },
  { id: "3", src: "/placeholder.svg?height=200&width=280&query=friends campfire night outdoor", alt: "여행 사진 3" },
  { id: "4", src: "/placeholder.svg?height=200&width=280&query=friends beach sunset group", alt: "여행 사진 4" },
]

export const mockReviews: Review[] = [
  {
    id: "1",
    title: "한라산 정상에서 본 풍경",
    author: "김민준",
    date: "26.03.02",
    views: 10,
    scheduleName: "제주도 서쪽 여행",
    thumbnail: "/placeholder.svg?height=160&width=160&query=friends hiking mountain summit korea",
    content: "새벽에 올라가서 본 일출이 최고였어요.",
    photo: "/placeholder.svg?height=400&width=600&query=friends hiking mountain summit korea group photo",
  },
  {
    id: "2",
    title: "글램핑에서 즐긴 마시멜로",
    author: "이지은",
    date: "26.03.02",
    views: 10,
    scheduleName: "제주도 서쪽 여행",
    thumbnail: "/placeholder.svg?height=160&width=160&query=friends glamping campfire marshmallow night",
    content: "밤바다 보면서 마시멜로 구워 먹기!",
    photo: "/placeholder.svg?height=400&width=600&query=friends glamping campfire marshmallow night cozy",
  },
  {
    id: "3",
    title: "숙소에서 바비큐 파티",
    author: "박서준",
    date: "26.03.02",
    views: 10,
    scheduleName: "제주도 서쪽 여행",
    thumbnail: "/placeholder.svg?height=160&width=160&query=friends bbq party accommodation sunset",
    content: "고기도 맛있고 분위기도 좋았어요.",
    photo: "/placeholder.svg?height=400&width=600&query=friends bbq party accommodation sunset celebration",
  },
  {
    id: "4",
    title: "모닥불과 별빛",
    author: "한지민",
    date: "26.03.02",
    views: 10,
    scheduleName: "제주도 서쪽 여행",
    thumbnail: "/placeholder.svg?height=160&width=160&query=friends campfire marshmallow roasting outdoor",
    content: "밤하늘 별이 정말 예뻤어요.",
    photo: "/placeholder.svg?height=400&width=600&query=friends campfire marshmallow roasting outdoor night",
  },
]

export const mockGroup: Group = {
  id: "1",
  groupId: 1,
  name: "즐거운 여행단",
  description: "MBTI P들의 모임입니다. 맛집 탐방!",
  image: "/trip_group_placeholder.png",
  thumbNailUrl: "/trip_group_placeholder.png",
  memberCount: 6,
  currentMemberCount: 6,
  maxMembers: 10,
  memberLimit: 10,
  members: mockMembers,
  schedules: mockSchedules,
  reviewPhotos: mockReviewPhotos,
  reviews: mockReviews,
}
