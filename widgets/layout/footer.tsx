import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/TriPle_logo_sm.png"
                  alt="TriPle Logo"
                  width={45}
                  height={20}
                  // style={{ width: "auto", height: "auto" }}
                />
            </Link>
            <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
              {"일정, 비용, 추억을 하나로. 여행 그룹 기반 일정 관리 서비스"}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground">{"서비스"}</span>
              <Link href="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground">{"그룹 둘러보기"}</Link>
              <Link href="/group/create" className="text-xs text-muted-foreground transition-colors hover:text-foreground">{"그룹 만들기"}</Link>
              <Link href="/mypage" className="text-xs text-muted-foreground transition-colors hover:text-foreground">{"마이페이지"}</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground">{"지원"}</span>
              <Link href="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground">{"이용약관"}</Link>
              <Link href="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground">{"개인정보처리방침"}</Link>
              <Link href="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground">{"고객센터"}</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">{"TriPle. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  )
}