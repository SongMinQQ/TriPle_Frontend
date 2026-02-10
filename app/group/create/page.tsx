"use client"

import { useState } from "react"
import { Header } from "@/widgets/layout/header"
import { Footer } from "@/widgets/layout/footer"
import { ImagePlus } from "lucide-react"

export default function GroupCreatePage() {
  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [maxMembers, setMaxMembers] = useState(6)
  const [isPublic, setIsPublic] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">{"그룹 생성"}</h1>

        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            {"기본 정보"}
            <span className="rounded bg-[#ff7a3d]/10 px-2 py-0.5 text-xs font-bold text-primary">
              {"필수"}
            </span>
          </h2>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground" htmlFor="group-name">
                {"그룹명"}
              </label>
              <span className="text-xs text-muted-foreground">
                {groupName.length}/15
              </span>
            </div>
            <input
              id="group-name"
              type="text"
              maxLength={15}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="그룹 이름을 입력하세요"
              className="mt-2 w-full border-b-2 border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
            />
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground" htmlFor="group-desc">
                {"그룹 설명"}
              </label>
              <span className="text-xs text-muted-foreground">
                {description.length}/300
              </span>
            </div>
            <textarea
              id="group-desc"
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="그룹 설명을 입력하세요"
              rows={3}
              className="mt-2 w-full resize-none border-b-2 border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
            />
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-foreground">{"그룹 최대 인원"}</label>
            <div className="mt-4">
              <input
                type="range"
                min={2}
                max={20}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>2</span>
                <span>20</span>
              </div>
              <p className="mt-2 text-center text-2xl font-bold text-foreground">{maxMembers}</p>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-foreground">{"그룹 공개 여부"}</label>
            <div className="mt-3 flex gap-4">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`text-sm font-semibold transition-colors ${
                  isPublic ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {"공개"}
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`text-sm font-semibold transition-colors ${
                  !isPublic ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {"비공개"}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-foreground">{"추가 정보"}</h2>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-foreground">{"그룹 이미지"}</label>
            <div className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/80">
              <ImagePlus className="h-5 w-5" />
              <span>{"파일을 선택하세요 (jpg, png)"}</span>
            </div>
          </div>
        </section>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            className="rounded-full bg-primary px-10 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {"그룹 생성하기"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
