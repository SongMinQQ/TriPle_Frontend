import Link from "next/link"
import { Header } from "@/widgets/layout/header"
import { Footer } from "@/widgets/layout/footer"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold text-primary">404</h1>
        <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-4xl">
          페이지를 찾을 수 없어요
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          요청하신 주소가 잘못되었거나 접근할 수 없는 그룹입니다.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            홈으로 이동
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
