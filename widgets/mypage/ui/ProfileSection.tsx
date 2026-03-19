"use client";

import { useState } from "react";
import { useMyProfileQuery } from "@/entities/user/queries/useMyProfileQuery";
import ProfileEditSection from "@/widgets/mypage/ui/ProfileEditSection";
import ProfileInfoSection from "@/widgets/mypage/ui/ProfileInfoSection";

const ProfileSection = () => {
  const { data: profile, isPending, isError, refetch } = useMyProfileQuery();
  const [isEditing, setIsEditing] = useState(false);

  if (isPending) {
    return (
      <section className="flex animate-pulse flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="h-40 w-40 rounded-full bg-muted" />
        <div className="w-full flex-1 space-y-4">
          <div className="h-7 w-40 rounded-md bg-muted" />
          <div className="h-5 w-56 rounded-md bg-muted" />
          <div className="h-20 rounded-xl bg-muted" />
        </div>
      </section>
    );
  }

  if (isError || !profile) {
    return (
      <section className="rounded-2xl border border-border bg-background p-6">
        <h2 className="text-lg font-semibold text-foreground">프로필</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          프로필 정보를 불러오지 못했어요.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          다시 시도
        </button>
      </section>
    );
  }

  if (isEditing) {
    return (
      <ProfileEditSection
        profile={profile}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <ProfileInfoSection
      profile={profile}
      onEdit={() => setIsEditing(true)}
    />
  );
};

export default ProfileSection;
