interface TransferOwnerButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function TransferOwnerButton({
  onClick,
  disabled,
}: TransferOwnerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      그룹장 양도
    </button>
  );
}
