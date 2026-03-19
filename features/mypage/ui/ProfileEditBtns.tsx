import { Check, ImagePlus, Pencil } from "lucide-react";

const ProfileSaveBtn = () => {
  return (
    <>
      <Check className="h-3.5 w-3.5" />
      {"저장"}
    </>
  );
};

const ProfileEditBtn = () => {
  return (
    <>
      <Pencil className="h-3.5 w-3.5" />
      {"수정"}
    </>
  );
};

interface ProfileImageEditBtnProps {
  disabled?: boolean;
  onClick?: () => void;
}

const ProfileImageEditBtn = ({
  disabled = false,
  onClick,
}: ProfileImageEditBtnProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="프로필 사진 변경"
    >
      <ImagePlus className="h-4 w-4" />
    </button>
  );
};

export { ProfileSaveBtn, ProfileEditBtn, ProfileImageEditBtn };
