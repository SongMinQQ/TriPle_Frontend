"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar } from "lucide-react"
import { mockMembers } from "@/entities/group/model/mock-data"
import { FieldLabelWithCounter } from "@/shared/ui/field-label-with-counter"

export default function ScheduleCreatePage() {
  const [title, setTitle] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([mockMembers[0].id])

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">{"일정 생성"}</h1>

      <div className="mt-8">
        <FieldLabelWithCounter
          htmlFor="schedule-name"
          label={"일정명"}
          currentLength={title.length}
          maxLength={20}
        />
        <input
          id="schedule-name"
          type="text"
          maxLength={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="일정 이름을 입력하세요"
          className="mt-2 w-full border-b-2 border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-8">
        <FieldLabelWithCounter label={"날짜"} />
        <div className="mt-3 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="시작일"
            />
          </div>
          <span className="text-sm text-muted-foreground">~</span>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="종료일"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <FieldLabelWithCounter
          label={
            <>
              {"일정 멤버"}{" "}
              <span className="text-primary">{selectedMembers.length}</span>
            </>
          }
        />
        <div className="mt-4 flex flex-wrap gap-3">
          {mockMembers.slice(0, 4).map((member) => {
            const isSelected = selectedMembers.includes(member.id)
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => toggleMember(member.id)}
                className={`flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-[#f4a261]/20 text-foreground ring-2 ring-[#f4a261]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Image
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                {member.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <button
          type="button"
          className="rounded-full bg-primary px-10 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {"일정 생성"}
        </button>
      </div>
    </div>
  )
}
