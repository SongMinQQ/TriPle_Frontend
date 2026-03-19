"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { MarkdownEditor } from "@/shared/ui/markdown-editor"
import { FieldLabelWithCounter } from "@/shared/ui/field-label-with-counter"
import { mockGroup } from "@/entities/group/model/mock-data"

export default function ReviewCreatePage() {
  const params = useParams()
  const router = useRouter()
  const group = mockGroup

  const [title, setTitle] = useState("")
  const [selectedSchedule, setSelectedSchedule] = useState("")
  const [content, setContent] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const selectedScheduleLabel =
    group.schedules.find((s) => s.id === selectedSchedule)?.title || ""

  const handleSubmit = () => {
    if (!title.trim() || !selectedSchedule || !content.trim()) return
    router.push(`/group/${params.id}/reviews`)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">{"후기 작성"}</h1>

      <div className="mt-8">
        <FieldLabelWithCounter
          htmlFor="review-title"
          label={"제목"}
          currentLength={title.length}
          maxLength={20}
        />
        <input
          id="review-title"
          type="text"
          maxLength={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="mt-2 w-full border-b-2 border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-foreground">{"일정 선택"}</h2>
        <div className="relative mt-3">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full max-w-xs items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted/70"
          >
            <span className={selectedScheduleLabel ? "text-foreground" : "text-muted-foreground"}>
              {selectedScheduleLabel || "일정을 선택하세요"}
            </span>
            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-full max-w-xs overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              {group.schedules.map((schedule) => (
                <button
                  key={schedule.id}
                  type="button"
                  onClick={() => {
                    setSelectedSchedule(schedule.id)
                    setIsDropdownOpen(false)
                  }}
                  className={`flex w-full items-center px-4 py-3 text-left text-sm transition-colors hover:bg-muted ${
                    selectedSchedule === schedule.id
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-foreground"
                  }`}
                >
                  {schedule.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      <div className="mt-8 flex justify-center pb-8">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {"작성 완료"}
        </button>
      </div>
    </div>
  )
}
