import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import QueryProvider from "@/components/providers/query-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "MyLink - 나만의 프리미엄 링크 모음 서비스",
  description: "포트폴리오, SNS, 블로그 등 여러 개의 링크를 하나의 세련된 마이링크 페이지로 통합하여 쉽게 관리하고 공유해 보세요.",
  openGraph: {
    title: "MyLink - 나만의 프리미엄 링크 모음 서비스",
    description: "포트폴리오, SNS, 블로그 등 여러 개의 링크를 하나의 세련된 마이링크 페이지로 통합하여 쉽게 관리하고 공유해 보세요.",
    siteName: "MyLink",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink - 나만의 프리미엄 링크 모음 서비스",
    description: "포트폴리오, SNS, 블로그 등 여러 개의 링크를 하나의 세련된 마이링크 페이지로 통합하여 쉽게 관리하고 공유해 보세요.",
  },
}

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster position="bottom-center" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
