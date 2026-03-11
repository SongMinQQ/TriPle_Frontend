import { AlertCircle } from "lucide-react";

interface GroupDetailQueryErrorStateProps {
  onRetry: () => void;
  compact?: boolean;
  title?: string;
  description?: string;
}

export function GroupDetailQueryErrorState({
  onRetry,
  compact = false,
  title = "그룹 정보를 불러오지 못했어요",
  description = "잠시 후 다시 시도해 주세요.",
}: GroupDetailQueryErrorStateProps) {
  const containerClassName = compact
    ? "rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center"
    : "rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center";

  const titleClassName = compact
    ? "mt-2 text-sm font-semibold text-destructive"
    : "mt-3 text-base font-semibold text-destructive";

  const descriptionClassName = compact
    ? "mt-1 text-xs text-muted-foreground"
    : "mt-2 text-sm text-muted-foreground";

  return (
    <div className={containerClassName}>
      <div className="inline-flex rounded-full bg-destructive/10 p-2 text-destructive">
        <AlertCircle className="h-4 w-4" />
      </div>
      <p className={titleClassName}>{title}</p>
      <p className={descriptionClassName}>{description}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
      >
        다시 시도
      </button>
    </div>
  );
}
