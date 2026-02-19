"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { UserRound } from "lucide-react"
import KakaoLoginBtn from "@/features/auth/KakaoLoginBtn"
import { hasUserSession } from "@/shared/api/user/hasUserSession"

const LOGO_HREF = "/"
const NAV_LINKS = [
  { href: "/", label: "내 여행 그룹" },
  { href: "/mypage", label: "마이페이지" },
]

export function Header() {
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const isAuthenticated = hasSession === true

  useEffect(() => {
    let mounted = true

    const syncSession = async () => {
      try {
        const active = await hasUserSession()
        if (mounted) {
          setHasSession(active)
        }
      } catch {
        if (mounted) {
          setHasSession(false)
        }
      }
    }

    void syncSession()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href={LOGO_HREF} className="flex items-center gap-2">
          <span className="relative block h-9 w-[118px] shrink-0 overflow-hidden sm:h-10 sm:w-[150px] lg:h-12 lg:w-[180px]">
            <Image
              src="/TriPle_logo_sm.png"
              alt="TriPle Logo"
              fill
              className="object-contain object-left"
              priority
              sizes="(max-width: 640px) 118px, (max-width: 1024px) 150px, 180px"
            />
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          {isAuthenticated
            ? NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
                >
                  {link.label}
                </Link>
              ))
            : null}
          {isAuthenticated ? (
            <Link
              href="/mypage"
              aria-label="마이페이지"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
            >
              <UserRound className="h-5 w-5" />
            </Link>
          ) : null}
          {hasSession === false ? <KakaoLoginBtn /> : null}
        </nav>
      </div>
    </header>
  )
}
