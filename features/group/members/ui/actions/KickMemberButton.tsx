interface KickMemberButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function KickMemberButton({ onClick, disabled }: KickMemberButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-destructive/40 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      추방
    </button>
  );
}
