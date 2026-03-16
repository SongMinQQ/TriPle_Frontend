interface ScheduleCreateSubmitButtonProps {
  isSubmitting?: boolean;
  disabled?: boolean;
}

export function ScheduleCreateSubmitButton({
  isSubmitting = false,
  disabled = false,
}: ScheduleCreateSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`rounded-full px-10 py-3.5 text-base font-bold text-primary-foreground transition-opacity ${
        disabled ? "cursor-not-allowed bg-primary/50" : "bg-primary hover:opacity-90"
      }`}
    >
      {isSubmitting ? "생성 중..." : "일정 생성"}
    </button>
  );
}
