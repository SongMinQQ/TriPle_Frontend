"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ProfileImageEditBtn,
  ProfileSaveBtn,
} from "@/features/mypage/ui/ProfileEditBtns";
import { updateUserProfile } from "@/entities/user/model/api/updateUserProfile";
import {
  normalizeUserGender,
  USER_GENDERS,
  type UserGender,
} from "@/entities/user/model/gender";
import { USER_QUERY_KEYS } from "@/entities/user/queries/user.query-keys";
import type { UpdateUserProfileRequest } from "@/entities/user/model/api/types";
import type { UserProfile } from "@/entities/user/model/types";
import { PLACEHOLDERS } from "@/shared/constants/constants";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { toast } from "@/shared/hooks/use-toast";
import { uploadFile } from "@/shared/lib/api/uploadFile";
import { showErrorToast } from "@/shared/lib/error-toast";

interface ProfileEditSectionProps {
  profile: UserProfile;
  onClose: () => void;
}

interface ProfileFormState {
  nickname: string;
  gender: UserGender;
  birth: string;
  description: string;
  profileUrl: string;
}

const GENDER_OPTIONS = [
  { label: "남성", value: USER_GENDERS.MALE },
  { label: "여성", value: USER_GENDERS.FEMALE },
] as const;

const createProfileFormState = (profile: UserProfile): ProfileFormState => ({
  nickname: profile.nickname,
  gender: normalizeUserGender(profile.gender) || USER_GENDERS.MALE,
  birth: profile.birth,
  description: profile.description,
  profileUrl: profile.profileUrl,
});

const createProfilePayload = (
  profileForm: ProfileFormState
): UpdateUserProfileRequest => ({
  nickname: profileForm.nickname.trim(),
  gender: normalizeUserGender(profileForm.gender) || USER_GENDERS.MALE,
  birth: profileForm.birth,
  description: profileForm.description.trim(),
  profileUrl: profileForm.profileUrl,
});

const hasProfileChanges = (
  profile: UserProfile,
  payload: UpdateUserProfileRequest
): boolean =>
  profile.nickname.trim() !== payload.nickname ||
  (normalizeUserGender(profile.gender) || USER_GENDERS.MALE) !== payload.gender ||
  profile.birth !== payload.birth ||
  profile.description.trim() !== payload.description ||
  (profile.profileUrl ?? "") !== payload.profileUrl;

const mergeUpdatedProfile = (
  profile: UserProfile,
  payload: UpdateUserProfileRequest
): UserProfile => ({
  ...profile,
  nickname: payload.nickname ?? profile.nickname,
  gender: normalizeUserGender(payload.gender ?? profile.gender) || "",
  birth: payload.birth ?? profile.birth,
  description: payload.description ?? profile.description,
  profileUrl: payload.profileUrl ?? profile.profileUrl,
});

const ProfileEditSection = ({
  profile,
  onClose,
}: ProfileEditSectionProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProfileFormState>(() =>
    createProfileFormState(profile)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleProfileImageClick = () => {
    if (isUploadingImage) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    setIsUploadingImage(true);

    try {
      const uploadedProfileUrl = await uploadFile(selectedFile);

      setForm((prev) => ({
        ...prev,
        profileUrl: uploadedProfileUrl,
      }));
    } catch (error) {
      showErrorToast({
        error,
        title: TOAST_MESSAGES.USER.PROFILE_IMAGE_UPLOAD_FAILURE.title,
        fallbackDescription:
          TOAST_MESSAGES.USER.PROFILE_IMAGE_UPLOAD_FAILURE.description,
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveClick = async () => {
    if (isSubmitting || isUploadingImage) {
      return;
    }

    const profilePayload = createProfilePayload(form);

    if (!hasProfileChanges(profile, profilePayload)) {
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUserProfile(profilePayload);

      const updatedProfile = mergeUpdatedProfile(profile, profilePayload);

      queryClient.setQueryData(USER_QUERY_KEYS.me(), updatedProfile);
      onClose();

      toast({
        title: TOAST_MESSAGES.USER.PROFILE_UPDATE_SUCCESS.title,
        description: TOAST_MESSAGES.USER.PROFILE_UPDATE_SUCCESS.description,
      });
    } catch (error) {
      showErrorToast({
        error,
        title: TOAST_MESSAGES.USER.PROFILE_UPDATE_FAILURE.title,
        fallbackDescription: TOAST_MESSAGES.USER.PROFILE_UPDATE_FAILURE.description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="relative shrink-0">
        <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-muted">
          <Image
            src={form.profileUrl || PLACEHOLDERS.PROFILE_AVATAR}
            alt={form.nickname || "프로필 이미지"}
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleProfileImageChange(event)}
        />
        <ProfileImageEditBtn
          disabled={isUploadingImage || isSubmitting}
          onClick={handleProfileImageClick}
        />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center gap-3 sm:justify-between">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={form.nickname}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, nickname: event.target.value }))
              }
              className="w-40 border-b-2 border-primary bg-transparent text-xl font-bold text-foreground outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => void handleSaveClick()}
            disabled={isSubmitting || isUploadingImage}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ProfileSaveBtn />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
          <select
            value={form.gender}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                gender:
                  normalizeUserGender(event.target.value) || USER_GENDERS.MALE,
              }))
            }
            className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground outline-none"
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.birth}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, birth: event.target.value }))
            }
            className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground outline-none"
          />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">{"한줄소개"}</span>
            <span className="text-xs text-muted-foreground">
              {form.description.length}자
            </span>
          </div>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
          />
        </div>
      </div>
    </section>
  );
};

export default ProfileEditSection;
