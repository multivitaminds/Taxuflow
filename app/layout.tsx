import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ConditionalNavigation } from "@/components/conditional-navigation"
import { AIChatWidget } from "@/components/ai-chat-widget"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Taxu - AI-Powered Tax Filing Assistant",
  description:
    "Taxes Filed by AI. Fast. Secure. All Year. Your always-on, always-learning AI tax assistant built for W-2 employees, gig workers, and founders.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ConditionalNavigation />
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <AIChatWidget />
        <Analytics />
      </body>
    </html>
  )
}
