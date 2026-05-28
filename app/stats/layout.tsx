import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "통계 대시보드 - MyLink",
  description: "내 마이링크의 각 링크 클릭 수와 방문 통계를 상세하게 모니터링합니다.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
