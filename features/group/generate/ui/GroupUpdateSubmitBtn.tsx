"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  GroupGenerateOptionalFormState,
  GroupGenerateRequiredFormState,
} from "@/features/group/generate/model/groupGenerateForm";
import { updateGroup } from "@/entities/group/model/api/updateGroup";
import type { GroupUpdateData } from "@/entities/group/model/api/types";
import { GROUP_QUERY_KEYS } from "@/entities/group/queries/group.query-keys";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { toast } from "@/shared/hooks/use-toast";
import { showErrorToast } from "@/shared/lib/error-toast";
import { useQueryClient } from "@tanstack/react-query";

interface GroupUpdateSubmitBtnProps {
  groupId: number;
  initialThumbNailUrl: string;
  isThumbnailRemoved: boolean;
  requiredForm: GroupGenerateRequiredFormState;
  optionalForm: GroupGenerateOptionalFormState;
}

const GroupUpdateSubmitBtn = ({
  groupId,
  initialThumbNailUrl,
  isThumbnailRemoved,
  requiredForm,
  optionalForm,
}: GroupUpdateSubmitBtnProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const trimmedName = requiredForm.groupName.trim();
    const trimmedDescription = requiredForm.description.trim();

    if (!trimmedName || !trimmedDescription) {
      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.GROUP.UPDATE_VALIDATION.title,
        description: TOAST_MESSAGES.GROUP.UPDATE_VALIDATION.description,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const groupData: GroupUpdateData = {
        name: trimmedName,
        description: trimmedDescription,
        memberLimit: requiredForm.maxMembers,
        groupKind: requiredForm.isPublic ? "PUBLIC" : "PRIVATE",
        thumbNailUrl: isThumbnailRemoved ? "" : initialThumbNailUrl,
      };

      await updateGroup({
        groupId,
        groupData,
        thumbnailFile: optionalForm.thumbnailFile,
      });

      toast({
        title: TOAST_MESSAGES.GROUP.UPDATE_SUCCESS.title,
        description: TOAST_MESSAGES.GROUP.UPDATE_SUCCESS.description,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: GROUP_QUERY_KEYS.detail(String(groupId)),
        }),
        queryClient.invalidateQueries({
          queryKey: GROUP_QUERY_KEYS.menu(String(groupId)),
        }),
      ]);

      router.push(`/group/${groupId}`);
    } catch (error) {
      showErrorToast({
        error,
        title: TOAST_MESSAGES.GROUP.UPDATE_FAILURE.title,
        fallbackDescription: TOAST_MESSAGES.GROUP.UPDATE_FAILURE.description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="rounded-full bg-primary px-10 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? "수정 중..." : "그룹 수정하기"}
    </button>
  );
};

export default GroupUpdateSubmitBtn;
