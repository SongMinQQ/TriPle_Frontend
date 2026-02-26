import { ImagePlus } from "lucide-react";
import { useRef, type ChangeEvent } from "react";

import type { GroupGenerateOptionalFormState } from "@/features/group/generate/model/groupGenerateForm";
import { LabeledFileSelectButtonField } from "@/shared/ui/labeled-form-fields";

interface GroupGenerateOptionalFieldsProps {
  form: GroupGenerateOptionalFormState;
  onThumbnailFileChange: (thumbnailFile: File | null) => void;
}

const GroupGenerateOptionalFields = ({
  form,
  onThumbnailFileChange,
}: GroupGenerateOptionalFieldsProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    onThumbnailFileChange(nextFile);
  };

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-foreground">{"추가 정보"}</h2>

      <LabeledFileSelectButtonField
        containerClassName="mt-6"
        label={"그룹 이미지"}
        icon={<ImagePlus className="h-5 w-5" />}
        helperText={form.thumbnailFile?.name ?? "파일을 선택하세요 (jpg, png)"}
        onClick={handleImageButtonClick}
      />
      <input
        ref={fileInputRef}
        type="file"
        name="group-image"
        accept="image/png,image/jpeg"
        className="hidden"
        data-testid="group-image-input"
        onChange={handleImageChange}
      />
    </section>
  );
};

export default GroupGenerateOptionalFields;
