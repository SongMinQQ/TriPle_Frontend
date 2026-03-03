import React from "react"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import type { GetGroupDetailResponse } from "@/entities/group/model/api/types"
import { REQUEST_PATHS } from "@/shared/constants/paths"
import { Header } from "@/widgets/layout/header"
import { Footer } from "@/widgets/layout/footer"
import { GroupSidebar } from "@/widgets/group/layout/group-sidebar"

const NOT_FOUND_RESPONSE_STATUS = new Set([401, 403, 404])

const parseRouteGroupId = (id: string): number | null => {
  if (!/^\d+$/.test(id)) {
    return null
  }

  const numericGroupId = Number(id)
  return Number.isSafeInteger(numericGroupId) && numericGroupId > 0
    ? numericGroupId
    : null
}

const fetchGroupDetailForGuard = async (
  groupId: number
): Promise<GetGroupDetailResponse> => {
  const serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS

  if (!serverAddress) {
    throw new Error("NEXT_PUBLIC_SERVER_ADDRESS is not configured.")
  }

  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const response = await fetch(`${serverAddress}${REQUEST_PATHS.GROUPS.DETAIL(groupId)}`, {
    method: "GET",
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  })

  if (!response.ok) {
    if (NOT_FOUND_RESPONSE_STATUS.has(response.status)) {
      notFound()
    }

    throw new Error(`Failed to fetch group detail for guard. status=${response.status}`)
  }

  return (await response.json()) as GetGroupDetailResponse
}

const shouldBlockByPrivacy = (detail: GetGroupDetailResponse): boolean => {
  const isPrivateGroup = detail.groupKind === "PRIVATE"
  const isGuest = !detail.role || detail.role === "GUEST"

  return isPrivateGroup && isGuest
}

export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numericGroupId = parseRouteGroupId(id)

  if (numericGroupId === null) {
    notFound()
  }

  const groupDetail = await fetchGroupDetailForGuard(numericGroupId)
  if (shouldBlockByPrivacy(groupDetail)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:px-8">
        <div className="hidden lg:block">
          <GroupSidebar groupId={id} />
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
