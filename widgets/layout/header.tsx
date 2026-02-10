"use client"

import Link from "next/link"
import Image from "next/image"

const LOGO_HREF = "/"
const NAV_LINKS = [
  { href: "/", label: "내 여행 그룹" },
  { href: "/mypage", label: "마이페이지" },
]
const KAKAO_LOGIN_HREF = "/"
const KAKAO_LOGIN_ALT = "카카오 로그인"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-6 lg:px-10">
        <Link href={LOGO_HREF} className="flex items-center gap-2">
          <span className="relative h-12 w-44 overflow-hidden">
            <Image
              src="/TriPle_logo.png"
              alt="TriPle Logo"
              fill
              objectFit="cover"
              priority
            />
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              {link.label}
            </Link>
          ))}
          <Link href={KAKAO_LOGIN_HREF} className="block">
            <Image
              src="/kakao_login_medium_narrow.png"
              alt={KAKAO_LOGIN_ALT}
              width={183}
              height={45}
              className="h-9 w-auto"
              priority
            />
          </Link>
        </nav>
      </div>
    </header>
  )
}
