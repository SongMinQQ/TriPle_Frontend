"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Share2, Plus, Copy, CircleDollarSign, X, Check } from "lucide-react"
import { mockSchedules, mockMembers } from "@/entities/group/model/mock-data"
import { MarkdownEditor } from "@/shared/ui/markdown-editor"

const initialSettlement = {
  accountNumber: "999999-00-999999",
  bankName: "KB국민",
  accountHolder: "김민준",
  totalAmount: 180000,
  members: [
    { id: "1", name: "김민준", avatar: mockMembers[0].avatar, amount: 180000, settled: false },
    { id: "2", name: "박서준", avatar: mockMembers[1].avatar, amount: 0, settled: true },
  ],
}

const mockItinerary = [
  {
    day: 1,
    items: ["비행기 탑승", "렌터카 픽업", "숙소", "동문시장 탐방"],
  },
]

export default function ScheduleDetailPage() {
  const schedule = mockSchedules[0]
  const [activeTab, setActiveTab] = useState<"itinerary" | "settlement">("itinerary")
  const [splitMode, setSplitMode] = useState<"equal" | "manual">("equal")
  const [isManualEditing, setIsManualEditing] = useState(false)

  const [settlement, setSettlement] = useState(initialSettlement)
  const [memberAmounts, setMemberAmounts] = useState<Record<string, string>>(
    Object.fromEntries(initialSettlement.members.map((m) => [m.id, m.amount.toString()]))
  )

  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [editAccount, setEditAccount] = useState({
    accountNumber: settlement.accountNumber,
    bankName: settlement.bankName,
    accountHolder: settlement.accountHolder,
  })

  const [markdownContent, setMarkdownContent] = useState(
    "## 1일차\n\n- 비행기 탑승\n- 렌터카 픽업\n- 숙소\n- 동문시장 탐방\n"
  )

  const handleSaveAccount = () => {
    setSettlement((prev) => ({
      ...prev,
      accountNumber: editAccount.accountNumber,
      bankName: editAccount.bankName,
      accountHolder: editAccount.accountHolder,
    }))
    setIsEditingAccount(false)
  }

  const handleAmountChange = (memberId: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    setMemberAmounts((prev) => ({ ...prev, [memberId]: numericValue }))
  }

  const handleManualToggle = () => {
    if (isManualEditing) {
      const updatedMembers = settlement.members.map((m) => ({
        ...m,
        amount: Number.parseInt(memberAmounts[m.id] || "0", 10),
      }))
      const newTotal = updatedMembers.reduce((sum, m) => sum + m.amount, 0)
      setSettlement((prev) => ({
        ...prev,
        totalAmount: newTotal,
        members: updatedMembers,
      }))
      setIsManualEditing(false)
      setSplitMode("manual")
    } else {
      setIsManualEditing(true)
      setSplitMode("manual")
    }
  }

  const handleEqualSplit = () => {
    setSplitMode("equal")
    setIsManualEditing(false)
    const perPerson = Math.floor(settlement.totalAmount / settlement.members.length)
    const updated = settlement.members.map((m) => ({ ...m, amount: perPerson }))
    setSettlement((prev) => ({ ...prev, members: updated }))
    setMemberAmounts(Object.fromEntries(updated.map((m) => [m.id, m.amount.toString()])))
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">{schedule.title}</h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{schedule.startDate}</span>
            <span>~</span>
            <Calendar className="h-4 w-4" />
            <span>{schedule.endDate}</span>
          </div>
        </div>
        <button type="button" aria-label="공유" className="text-muted-foreground transition-colors hover:text-foreground">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-foreground">
          {"일정 멤버"}{" "}
          <span className="text-primary">{settlement.members.length}</span>
        </h3>
        <div className="mt-3 flex items-center gap-2">
          {settlement.members.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <Image
                src={member.avatar || "/placeholder.svg"}
                alt={member.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span className="text-sm text-foreground">{member.name}</span>
            </div>
          ))}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "itinerary" ? "settlement" : "itinerary")}
          className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {activeTab === "itinerary" ? "정산 보기" : "일정 작성"}
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "itinerary" ? (
          <MarkdownEditor value={markdownContent} onChange={setMarkdownContent} />
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{"계좌번호"}</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingAccount(true)}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {"계좌 변경"}
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
                <span className="flex-1 text-sm font-medium text-foreground">
                  {settlement.accountNumber} {settlement.bankName} {"예금주: "}{settlement.accountHolder}
                </span>
                <button type="button" className="text-muted-foreground transition-colors hover:text-foreground">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-sm font-bold text-foreground">
                  {"총 금액: "}{settlement.totalAmount.toLocaleString()}{"원"}
                </h3>
                <button type="button" className="text-xs text-muted-foreground underline">{"자세히 보기"}</button>
                <button type="button" className="text-xs text-muted-foreground">{"결제내역 추가"}</button>
                <button type="button" className="flex items-center gap-1 text-xs text-muted-foreground">
                  {"영수증 스캔하기"}
                  <CircleDollarSign className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{"정산 현황"}</h3>
                  <div className="mt-1 flex gap-3">
                    <button
                      type="button"
                      onClick={handleEqualSplit}
                      className={`text-xs font-medium transition-colors ${splitMode === "equal" && !isManualEditing ? "text-foreground underline" : "text-muted-foreground"}`}
                    >
                      {"N/1 하기"}
                    </button>
                    <button
                      type="button"
                      onClick={handleManualToggle}
                      className={`text-xs font-medium transition-colors ${isManualEditing ? "text-primary underline" : splitMode === "manual" ? "text-foreground underline" : "text-muted-foreground"}`}
                    >
                      {isManualEditing ? "확정하기" : "직접 입력"}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full border-2 border-primary px-4 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {"정산 완료"}
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                {settlement.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Image
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="shrink-0 rounded-full object-cover"
                    />
                    <span className="w-16 shrink-0 text-sm font-medium text-foreground">{member.name}</span>
                    <div className="flex-1 text-right">
                      {isManualEditing ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          value={memberAmounts[member.id] ?? ""}
                          onChange={(e) => handleAmountChange(member.id, e.target.value)}
                          className="w-28 border-b-2 border-primary bg-transparent text-right text-sm font-bold text-foreground outline-none"
                          placeholder="0"
                        />
                      ) : (
                        <span className="text-sm font-bold text-foreground">
                          {member.amount.toLocaleString()}
                        </span>
                      )}
                      <span className="ml-1 text-sm text-foreground">{"원"}</span>
                    </div>
                    <div className="w-24 shrink-0">
                      <span className={`flex items-center justify-end gap-1 text-xs font-medium ${member.settled ? "text-green-600" : "text-red-500"}`}>
                        <span className={`inline-block h-2 w-2 rounded-full ${member.settled ? "bg-green-500" : "bg-red-500"}`} />
                        {member.settled ? "정산 완료" : "정산 미완료"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isEditingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{"계좌 변경"}</h2>
              <button
                type="button"
                onClick={() => setIsEditingAccount(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-5">
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="edit-bank">{"은행"}</label>
                <input
                  id="edit-bank"
                  type="text"
                  value={editAccount.bankName}
                  onChange={(e) => setEditAccount((p) => ({ ...p, bankName: e.target.value }))}
                  placeholder="은행명을 입력하세요"
                  className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="edit-account">{"계좌번호"}</label>
                <input
                  id="edit-account"
                  type="text"
                  value={editAccount.accountNumber}
                  onChange={(e) => setEditAccount((p) => ({ ...p, accountNumber: e.target.value }))}
                  placeholder="계좌번호를 입력하세요"
                  className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="edit-holder">{"예금주"}</label>
                <input
                  id="edit-holder"
                  type="text"
                  value={editAccount.accountHolder}
                  onChange={(e) => setEditAccount((p) => ({ ...p, accountHolder: e.target.value }))}
                  placeholder="예금주를 입력하세요"
                  className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditingAccount(false)}
                className="flex-1 rounded-full border border-border bg-transparent py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                {"취소"}
              </button>
              <button
                type="button"
                onClick={handleSaveAccount}
                className="flex-1 rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {"저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
