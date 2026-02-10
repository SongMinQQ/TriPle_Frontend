"use client"

import { useState } from "react"
import { mockGroup } from "@/entities/group/model/mock-data"
import { MemberCard } from "@/entities/member/ui/member-card"
import { Copy, Check, Link2, X } from "lucide-react"

export default function MembersPage() {
  const group = mockGroup
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteLink = `https://triple.app/invite/${group.id}?code=aBcD1234`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = inviteLink
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">
        {"멤버"}{" "}
        <span className="text-primary">{group.memberCount}</span>
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {group.members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {"초대 링크"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{"초대 링크"}</h2>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setCopied(false)
                }}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {"아래 링크를 공유해 그룹에 멤버를 초대하세요."}
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
              <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-sm text-foreground">{inviteLink}</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all ${
                copied
                  ? "bg-green-500 text-background"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  {"복사 완료!"}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {"링크 복사하기"}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
