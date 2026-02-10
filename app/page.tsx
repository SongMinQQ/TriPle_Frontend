"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/widgets/layout/header"
import { Footer } from "@/widgets/layout/footer"
import { Users } from "lucide-react"
import { mockGroup } from "@/entities/group/model/mock-data"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[420px] w-full overflow-hidden lg:h-[480px]">
        <Image
          src="/TriPle_thumbnail.png"
          alt="여행하는 친구들"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4">
          <h1 className="text-center text-3xl font-extrabold text-[#ffffff] drop-shadow-lg sm:text-4xl lg:text-5xl text-balance">
            {"일정, 비용, 추억을 하나로 TriPle"}
          </h1>
          <Link
            href="/group/create"
            className="rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:opacity-90 sm:text-lg"
          >
            {"여행 그룹 만들기"}
          </Link>
        </div>
      </section>

      {/* Group Browse Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-foreground">{"그룹 찾아보기"}</h2>
        <div className="flex flex-col gap-4">
          {[mockGroup].map((group) => (
            <div
              key={group.id}
              className="flex flex-col items-start gap-5 rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center"
            >
              <Image
                src={group.image || "/placeholder.svg"}
                alt={group.name}
                width={100}
                height={100}
                className="rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{group.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{group.description}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{group.memberCount}/{group.maxMembers}</span>
                </div>
              </div>
              <Link
                href={`/group/${group.id}`}
                className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {"자세히 보기"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
