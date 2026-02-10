"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, CalendarRange, BookOpen, Share2, Users } from "lucide-react"
import type { Group } from "@/entities/group/model/mock-data"

interface GroupSidebarProps {
  group: Group
}

const navItems = [
  { label: "홈", icon: Home, href: "" },
  { label: "여행 일정", icon: CalendarRange, href: "/schedules" },
  { label: "여행 후기", icon: BookOpen, href: "/reviews" },
]

export function GroupSidebar({ group }: GroupSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="rounded-xl border border-border bg-background p-5">
        {/* Mobile: centered layout / Desktop: horizontal layout */}
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left">
          {/* Avatar */}
          <div className="relative">
            <Image
              src={group.image || "/trip_group_placeholder.png"}
              alt={group.name}
              width={72}
              height={72}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Info */}
          <div className="mt-3 flex flex-col items-center lg:mt-0 lg:ml-4 lg:flex-1 lg:items-start">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">{group.name}</h2>
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
                {group.memberCount}/{group.maxMembers}
              </span>
            </div>
            <button
              type="button"
              className="mt-2 rounded-full bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {"가입 신청"}
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
          {group.description}
        </p>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1 border-t border-border pt-4">
          {navItems.map((item) => {
            const fullHref = `/group/${group.id}${item.href}`
            const isActive = pathname === fullHref
            return (
              <Link
                key={item.label}
                href={fullHref}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}