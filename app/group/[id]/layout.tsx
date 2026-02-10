import React from "react"
import { Header } from "@/widgets/layout/header"
import { Footer } from "@/widgets/layout/footer"
import { GroupSidebar } from "@/widgets/group/group-sidebar"
import { mockGroup } from "@/entities/group/model/mock-data"

export default async function GroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const group = mockGroup

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:px-8">
        <div className="hidden lg:block">
          <GroupSidebar group={group} />
        </div>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
