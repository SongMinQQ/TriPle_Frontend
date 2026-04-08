"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import { getMyProfile } from "@/entities/user/model/api/getMyProfile";
import { useCurrentUserStore } from "@/entities/user/model/currentUserStore";
import { USER_QUERY_KEYS } from "@/entities/user/queries/user.query-keys";
import KakaoLoginBtn from "@/features/auth/KakaoLoginBtn";
import { hasUserSession } from "@/features/auth/api/hasUserSession";
import { AUTH_EVENTS } from "@/shared/constants/auth";
import { getAuthSessionHint } from "@/shared/lib/auth-session-hint";

const LOGO_HREF = "/";
const NAV_LINKS = [
  { href: "/", label: "내 여행 그룹" },
  { href: "/mypage", label: "마이페이지" },
];

export function Header() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const authStatus = useCurrentUserStore((state) => state.status);
  const setPending = useCurrentUserStore((state) => state.setPending);
  const setAuthenticatedUser = useCurrentUserStore(
    (state) => state.setAuthenticatedUser
  );
  const setUnauthenticated = useCurrentUserStore(
    (state) => state.setUnauthenticated
  );
  const isAuthenticated = currentUser !== null;

  useEffect(() => {
    let mounted = true;

    const clearCurrentUserState = () => {
      queryClient.removeQueries({
        queryKey: USER_QUERY_KEYS.me(),
      });
      setUnauthenticated();
    };

    const handleSessionExpired = () => {
      if (!mounted) {
        return;
      }

      clearCurrentUserState();
    };

    const syncCurrentUser = async () => {
      setPending();

      if (getAuthSessionHint() === false) {
        if (mounted) {
          clearCurrentUserState();
        }
        return;
      }

      try {
        const active = await hasUserSession();

        if (!mounted) {
          return;
        }

        if (!active) {
          clearCurrentUserState();
          return;
        }

        const profile = await queryClient.fetchQuery({
          queryKey: USER_QUERY_KEYS.me(),
          queryFn: getMyProfile,
          staleTime: 1000 * 30,
        });

        if (!mounted) {
          return;
        }

        setAuthenticatedUser(profile);
      } catch {
        if (!mounted) {
          return;
        }

        clearCurrentUserState();
      }
    };

    void syncCurrentUser();
    window.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);

    return () => {
      mounted = false;
      window.removeEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
    };
  }, [queryClient, setAuthenticatedUser, setPending, setUnauthenticated]);

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
          {authStatus === "unauthenticated" ? <KakaoLoginBtn /> : null}
        </nav>
      </div>
    </header>
  );
}
