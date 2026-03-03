import type { GroupDetailRole } from "@/entities/group/model/api/types";

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  isLeader?: boolean;
}

export interface Schedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  memberCount: number;
  dayCount: number;
}

export interface ReviewPhoto {
  id: string;
  src: string;
  alt: string;
}

export interface Review {
  id: string;
  title: string;
  author: string;
  date: string;
  views: number;
  scheduleName: string;
  thumbnail: string;
  content: string;
  photo: string;
}

export interface Group {
  id: string;
  groupId: number;
  name: string;
  description: string;
  image?: string;
  thumbNailUrl: string;
  currentMemberCount: number;
  memberLimit: number;
  role: GroupDetailRole;
  members: Member[];
  schedules: Schedule[];
  reviewPhotos: ReviewPhoto[];
  reviews: Review[];
}
