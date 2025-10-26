import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ConditionalNavigation } from "@/components/conditional-navigation"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ConditionalNavigation />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <AIChatWidget />
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
