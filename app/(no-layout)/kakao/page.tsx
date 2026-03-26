"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/shared/hooks/use-toast";
import { kakaoOauthLogin } from "@/features/auth/api/kakaoOauthLogin";
import { consumeOAuthReturnPath } from "@/shared/lib/auth-return-path";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { setAuthSessionHint } from "@/shared/lib/auth-session-hint";
import { showErrorToast } from "@/shared/lib/error-toast";

function KakaoCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  useEffect(() => {
    const returnPath = consumeOAuthReturnPath();
    const replaceToReturnPath = () => {
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", returnPath);
      }
      router.replace(returnPath);
    };

    if (!code) {
      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.AUTH.LOGIN_FAILURE.title,
        description: TOAST_MESSAGES.AUTH.LOGIN_FAILURE.description,
      });
      replaceToReturnPath();
      return;
    }

    const loginWithOAuthCode = async () => {
      try {
        await kakaoOauthLogin(code);
        setAuthSessionHint(true);
        toast({
          title: TOAST_MESSAGES.AUTH.LOGIN_SUCCESS.title,
          description: TOAST_MESSAGES.AUTH.LOGIN_SUCCESS.description,
        });
      } catch (error) {
        showErrorToast({
          error,
          title: TOAST_MESSAGES.AUTH.LOGIN_FAILURE.title,
          fallbackDescription: TOAST_MESSAGES.AUTH.LOGIN_FAILURE.description,
        });
      } finally {
        replaceToReturnPath();
      }
    };

    void loginWithOAuthCode();
  }, [code, router]);

  return null;
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<div>Signing in...</div>}>
      <KakaoCallbackInner />
    </Suspense>
  );
}
