"use client";

import Image from "next/image";
import { toast } from "@/shared/hooks/use-toast";
import { saveOAuthReturnPath } from "@/shared/lib/auth-return-path";

const KAKAO_LOGIN_ALT = "Kakao login";

const KakaoLoginBtn = () => {
  const login = () => {
    const kakaoBase = process.env.NEXT_PUBLIC_KAKAO_URL;
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const redirect = process.env.NEXT_PUBLIC_REDIRECT_URI;

    if (!kakaoBase || !clientId || !redirect) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Kakao login configuration is missing.",
      });
      return;
    }

    saveOAuthReturnPath();

    const kakaoUrl = `${kakaoBase}&client_id=${clientId}&redirect_uri=${redirect}`;

    window.location.replace(kakaoUrl);
  };

  return (
    <button type="button" onClick={login} className="block">
      <Image
        src="/kakao_login_medium_narrow.png"
        alt={KAKAO_LOGIN_ALT}
        width={183}
        height={45}
        className="h-8 w-auto sm:h-9"
        priority
      />
    </button>
  );
};

export default KakaoLoginBtn;
