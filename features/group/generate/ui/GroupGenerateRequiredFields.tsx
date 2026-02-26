import type { GroupGenerateRequiredFormState } from "@/features/group/generate/model/groupGenerateForm";
import { FieldLabelWithCounter } from "@/shared/ui/field-label-with-counter";
import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_MEMBER_MAX_LIMIT,
  GROUP_MEMBER_MIN_LIMIT,
  GROUP_NAME_MAX_LENGTH,
} from "@/entities/group/model/constants";
import {
  LabeledInputField,
  LabeledRangeField,
  LabeledTextareaField,
} from "@/shared/ui/labeled-form-fields";
import { cn } from "@/shared/lib/utils";

interface GroupGenerateRequiredFieldsProps {
  form: GroupGenerateRequiredFormState;
  onGroupNameChange: (groupName: string) => void;
  onDescriptionChange: (description: string) => void;
  onMaxMembersChange: (maxMembers: number) => void;
  onIsPublicChange: (isPublic: boolean) => void;
}

const GroupGenerateRequiredFields = ({
  form,
  onGroupNameChange,
  onDescriptionChange,
  onMaxMembersChange,
  onIsPublicChange,
}: GroupGenerateRequiredFieldsProps) => {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
        {"기본 정보"}
        <span className="rounded bg-[#ff7a3d]/10 px-2 py-0.5 text-xs font-bold text-primary">
          {"필수"}
        </span>
      </h2>

      <LabeledInputField
        containerClassName="mt-6"
        id="group-name"
        type="text"
        maxLength={GROUP_NAME_MAX_LENGTH}
        value={form.groupName}
        onChange={(event) => onGroupNameChange(event.target.value)}
        label={"그룹명"}
        counterCurrentLength={form.groupName.length}
        counterMaxLength={GROUP_NAME_MAX_LENGTH}
        placeholder="그룹 이름을 입력하세요"
      />

      <LabeledTextareaField
        containerClassName="mt-8"
        id="group-desc"
        maxLength={GROUP_DESCRIPTION_MAX_LENGTH}
        value={form.description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        label={"그룹 설명"}
        counterCurrentLength={form.description.length}
        counterMaxLength={GROUP_DESCRIPTION_MAX_LENGTH}
        placeholder="그룹 설명을 입력하세요"
        rows={3}
      />

      <LabeledRangeField
        containerClassName="mt-8"
        label={"그룹 최대 인원"}
        min={GROUP_MEMBER_MIN_LIMIT}
        max={GROUP_MEMBER_MAX_LIMIT}
        value={form.maxMembers}
        onValueChange={onMaxMembersChange}
      />

      <div className="mt-8">
        <FieldLabelWithCounter label={"그룹 공개 여부"} />
        <div className="mt-3 flex gap-4">
          <button
            type="button"
            onClick={() => onIsPublicChange(true)}
            className={cn(
              "text-sm font-semibold transition-colors",
              form.isPublic ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {"공개"}
          </button>
          <button
            type="button"
            onClick={() => onIsPublicChange(false)}
            className={cn(
              "text-sm font-semibold transition-colors",
              !form.isPublic ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {"비공개"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default GroupGenerateRequiredFields;
