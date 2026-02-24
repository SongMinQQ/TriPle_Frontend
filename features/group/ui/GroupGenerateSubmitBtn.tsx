"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  GroupGenerateOptionalFormState,
  GroupGenerateRequiredFormState,
} from "@/features/group/model/groupGenerateForm";
import { generateGroup } from "@/shared/api/group/generateGroup";
import type { GroupGenerateData } from "@/shared/api/group/types";
import { toast } from "@/shared/hooks/use-toast";

interface GroupGenerateSubmitBtnProps {
  requiredForm: GroupGenerateRequiredFormState;
  optionalForm: GroupGenerateOptionalFormState;
}

const GroupGenerateSubmitBtn = ({
  requiredForm,
  optionalForm,
}: GroupGenerateSubmitBtnProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const trimmedName = requiredForm.groupName.trim();
    const trimmedDescription = requiredForm.description.trim();

    if (!trimmedName || !trimmedDescription) {
      toast({
        variant: "destructive",
        title: "입력값을 확인해주세요.",
        description: "그룹명과 그룹 설명은 필수입니다.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const groupData: GroupGenerateData = {
        name: trimmedName,
        description: trimmedDescription,
        memberLimit: requiredForm.maxMembers,
        groupKind: requiredForm.isPublic ? "PUBLIC" : "PRIVATE",
        thumbNailUrl: "",
      };

      const response = await generateGroup({
        groupData,
        thumbnailFile: optionalForm.thumbnailFile,
      });

      toast({
        title: "그룹 생성 완료",
        description: "새 그룹이 성공적으로 생성되었습니다.",
      });

      router.push(`/group/${response.groupId}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "그룹 생성 중 문제가 발생했습니다.";

      toast({
        variant: "destructive",
        title: "그룹 생성 실패",
        description: message,
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
      {isSubmitting ? "생성 중..." : "그룹 생성하기"}
    </button>
  );
};

export default GroupGenerateSubmitBtn;
