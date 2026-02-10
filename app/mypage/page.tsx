"use client"

import { Header } from "@/widgets/layout/header"
import { Footer } from "@/widgets/layout/footer"

export default function MyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">내 페이지</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          내 여행 그룹과 일정, 리뷰를 관리할 수 있는 공간입니다.
        </p>

        <section className="mt-8 rounded-xl border border-border bg-background p-6">
          <h2 className="text-lg font-semibold text-foreground">프로필</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            프로필 정보와 선호 여행 스타일을 설정해보세요.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
