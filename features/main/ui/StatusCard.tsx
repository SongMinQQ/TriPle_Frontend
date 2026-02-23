export type StatusCardStatus = "loading" | "error" | "empty";

interface StatusCardProps {
  status: StatusCardStatus;
}

const STATUS_MESSAGE: Record<StatusCardStatus, string> = {
  loading: "그룹을 불러오는 중입니다.",
  error: "그룹 조회에 실패했습니다.",
  empty: "조회된 그룹이 없습니다.",
};

const StatusCard = ({ status }: StatusCardProps) => {
  const isError = status === "error";
  const className = isError
    ? "rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive mt-6"
    : "rounded-xl border border-border bg-background p-5 text-sm text-muted-foreground mt-6";

  return <div className={className}>{STATUS_MESSAGE[status]}</div>;
};

export default StatusCard;
