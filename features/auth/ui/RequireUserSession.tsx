"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { hasUserSession } from "@/features/auth/api/hasUserSession";
import { AUTH_EVENTS, AUTH_FALLBACK_PATH } from "@/shared/constants/auth";
import { saveOAuthReturnPath } from "@/shared/lib/auth-return-path";

interface RequireUserSessionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const redirectToFallback = (router: ReturnType<typeof useRouter>) => {
  saveOAuthReturnPath();
  router.replace(AUTH_FALLBACK_PATH);
};

export default function RequireUserSession({
  children,
  fallback = null,
}: RequireUserSessionProps) {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleSessionExpired = () => {
      if (!mounted) {
        return;
      }

      setHasSession(false);
      redirectToFallback(router);
    };

    const syncSession = async () => {
      try {
        const active = await hasUserSession();

        if (!mounted) {
          return;
        }

        if (!active) {
          setHasSession(false);
          redirectToFallback(router);
          return;
        }

        setHasSession(true);
      } catch {
        if (!mounted) {
          return;
        }

        setHasSession(false);
        redirectToFallback(router);
      }
    };

    void syncSession();
    window.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);

    return () => {
      mounted = false;
      window.removeEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
    };
  }, [router]);

  if (hasSession !== true) {
    return fallback;
  }

  return <>{children}</>;
}
