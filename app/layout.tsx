import React from "react"
import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'

import '@/shared/styles/globals.css'
import { Toaster } from "@/shared/ui/toaster"
import { QueryProvider } from "@/shared/providers/query-provider"

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'TriPle - 여행 그룹 일정 관리',
  description: '일정, 비용, 추억을 하나로 여행 그룹 기반 일정 관리 서비스',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} antialiased`}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
