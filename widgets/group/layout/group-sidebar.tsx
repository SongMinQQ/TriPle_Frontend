"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, CalendarRange, BookOpen, Share2, Users } from "lucide-react";
import { useGroupMenuQuery } from "@/entities/group/queries/group.queries";
import {
  GroupMembershipActionButton,
  getGroupMembershipAction,
  getMembershipStateFromGroupRole,
} from "@/features/group/detail/ui/GroupMembershipActionButton";
import { useGroupMembershipAction } from "@/features/group/detail/model/useGroupMembershipAction";
import { cn } from "@/shared/lib/utils";

interface GroupSidebarProps {
  groupId: string;
}

const navItems = [
  { label: "홈", icon: Home, href: "" },
  { label: "여행 일정", icon: CalendarRange, href: "/schedules" },
  { label: "여행 후기", icon: BookOpen, href: "/reviews" },
];

export function GroupSidebar({ groupId }: GroupSidebarProps) {
  const pathname = usePathname();
  const { data: groupMenu } = useGroupMenuQuery(groupId);
  const { isJoining, isLeaving, requestJoinGroup, requestLeaveGroup } =
    useGroupMembershipAction(groupId);

  const membershipAction = groupMenu?.role
    ? getGroupMembershipAction(getMembershipStateFromGroupRole(groupMenu.role))
    : null;
  const isJoinAction = membershipAction === "join";
  const isLeaveAction = membershipAction === "leave";
  let isMembershipActionDisabled = false;
  let handleMembershipActionClick: (() => void) | undefined;

  if (isJoinAction) {
    isMembershipActionDisabled = isJoining;
    handleMembershipActionClick = () => void requestJoinGroup();
  } else if (isLeaveAction) {
    isMembershipActionDisabled = isLeaving;
    handleMembershipActionClick = () => void requestLeaveGroup();
  }

  if (!groupMenu) {
    return null;
  }

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="rounded-xl border border-border bg-background p-5">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left">
          <div className="relative">
            <Image
              src={groupMenu.thumbNailUrl || "/trip_group_placeholder.png"}
              alt={groupMenu.name}
              width={72}
              height={72}
              className="rounded-xl object-cover"
            />
          </div>

          <div className="mt-3 flex flex-col items-center lg:ml-4 lg:mt-0 lg:flex-1 lg:items-start">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">{groupMenu.name}</h2>
              <button
                type="button"
                aria-label="공유"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>
                {groupMenu.currentMemberCount}/{groupMenu.memberLimit}
              </span>
            </div>
            {membershipAction ? (
              <GroupMembershipActionButton
                action={membershipAction}
                className="mt-2"
                disabled={isMembershipActionDisabled}
                onClick={handleMembershipActionClick}
              />
            ) : null}
          </div>
        </div>

        <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
          {groupMenu.description}
        </p>

        <nav className="mt-6 flex flex-col gap-1 border-t border-border pt-4">
          {navItems.map((item) => {
            const fullHref = `/group/${groupId}${item.href}`;
            const isActive = pathname === fullHref;
            return (
              <Link
                key={item.label}
                href={fullHref}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
