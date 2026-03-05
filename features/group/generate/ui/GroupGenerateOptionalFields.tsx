import { ImagePlus } from "lucide-react";
import { useRef, type ChangeEvent } from "react";

import type { GroupGenerateOptionalFormState } from "@/features/group/generate/model/groupGenerateForm";
import { LabeledFileSelectButtonField } from "@/shared/ui/labeled-form-fields";

interface GroupGenerateOptionalFieldsProps {
  form: GroupGenerateOptionalFormState;
  previewSrc?: string | null;
  onThumbnailFileChange: (thumbnailFile: File | null) => void;
  onThumbnailRemove: () => void;
}

const GroupGenerateOptionalFields = ({
  form,
  previewSrc,
  onThumbnailFileChange,
  onThumbnailRemove,
}: GroupGenerateOptionalFieldsProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    onThumbnailFileChange(nextFile);
  };

  const handleRemoveClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onThumbnailRemove();
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

      {previewSrc ? (
        <div className="mt-4 flex items-center gap-3">
          <div className="h-[100px] w-[100px] overflow-hidden rounded-xl border border-border">
            <img
              src={previewSrc}
              alt="그룹 이미지 미리보기"
              className="h-[100px] w-[100px] object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveClick}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            이미지 제거
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default GroupGenerateOptionalFields;
