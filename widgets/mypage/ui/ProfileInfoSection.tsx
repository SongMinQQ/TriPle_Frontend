"use client";

import Image from "next/image";
import { ProfileEditBtn } from "@/features/mypage/ui/ProfileEditBtns";
import {
  normalizeUserGender,
  USER_GENDERS,
} from "@/entities/user/model/gender";
import type { UserProfile } from "@/entities/user/model/types";
import { PLACEHOLDERS } from "@/shared/constants/constants";

interface ProfileInfoSectionProps {
  profile: UserProfile;
  onEdit: () => void;
}

const getGenderLabel = (gender: string): string => {
  if (normalizeUserGender(gender) === USER_GENDERS.FEMALE) {
    return "여성";
  }

  if (normalizeUserGender(gender) === USER_GENDERS.MALE) {
    return "남성";
  }

  return "미입력";
};

const getGenderSymbol = (gender: string): string => {
  if (normalizeUserGender(gender) === USER_GENDERS.FEMALE) {
    return "♀";
  }

  if (normalizeUserGender(gender) === USER_GENDERS.MALE) {
    return "♂";
  }

  return "•";
};

const formatBirth = (birth: string): string => {
  if (!birth) {
    return "생일 미입력";
  }

  return birth.replaceAll("-", ".");
};

const ProfileInfoSection = ({
  profile,
  onEdit,
}: ProfileInfoSectionProps) => {
  return (
    <section className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="relative shrink-0">
        <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-muted">
          <Image
            src={profile.profileUrl || PLACEHOLDERS.PROFILE_AVATAR}
            alt={profile.nickname || "프로필 이미지"}
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center gap-3 sm:justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">
              {profile.nickname}
            </h1>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-full border border-border bg-transparent px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            <ProfileEditBtn />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
          <span>
            {getGenderSymbol(profile.gender)} {getGenderLabel(profile.gender)}
          </span>
          <span>{"🎂 "}{formatBirth(profile.birth)}</span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">
              {"한줄소개"}
            </span>
            <span className="text-xs text-muted-foreground">
              {profile.description?.length ?? 0}자
            </span>
          </div>
          <p className="mt-2 rounded-xl border border-border px-3 py-3 text-sm text-muted-foreground">
            {profile.description || "소개가 아직 없어요."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileInfoSection;
