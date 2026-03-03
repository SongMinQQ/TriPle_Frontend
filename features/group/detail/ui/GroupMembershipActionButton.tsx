import Link from "next/link";
import type { MouseEventHandler } from "react";
import type { GroupDetailRole } from "@/entities/group/model/api/types";
import { cn } from "@/shared/lib/utils";

export type GroupMembershipAction = "manage" | "join" | "leave";
export type GroupMembershipState = "owner" | "member" | "guest";

interface GroupMembershipActionButtonProps {
  action: GroupMembershipAction;
  href?: string;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const ACTION_LABEL: Record<GroupMembershipAction, string> = {
  manage: "그룹 관리",
  join: "가입 신청",
  leave: "그룹 탈퇴",
};

const ACTION_STYLE: Record<GroupMembershipAction, string> = {
  manage: "bg-primary text-primary-foreground hover:opacity-90",
  join: "bg-primary text-primary-foreground hover:opacity-90",
  leave: "bg-destructive text-destructive-foreground hover:opacity-90",
};

export function getMembershipStateFromGroupRole(
  role: GroupDetailRole | undefined
): GroupMembershipState {
  const normalizedRole = typeof role === "string" ? role.toUpperCase() : "";

  if (normalizedRole === "OWNER") {
    return "owner";
  }

  if (normalizedRole === "MEMBER") {
    return "member";
  }

  return "guest";
}

export function getGroupMembershipAction(
  membershipState: GroupMembershipState
): GroupMembershipAction {
  if (membershipState === "owner") {
    return "manage";
  }

  if (membershipState === "member") {
    return "leave";
  }

  return "join";
}

export function GroupMembershipActionButton({
  action,
  href,
  className,
  disabled = false,
  onClick,
}: GroupMembershipActionButtonProps) {
  const buttonClassName = cn(
    "rounded-full px-5 py-1.5 text-xs font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-60",
    ACTION_STYLE[action],
    disabled && "pointer-events-none opacity-60",
    className
  );

  if (href) {
    return (
      <Link href={href} className={buttonClassName} aria-disabled={disabled}>
        {ACTION_LABEL[action]}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
    >
      {ACTION_LABEL[action]}
    </button>
  );
}
