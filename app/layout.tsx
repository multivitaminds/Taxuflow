import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ConditionalNavigation } from "@/components/conditional-navigation"
import { TaxuChatWidget } from "@/components/taxu-chat-widget"
import { ErrorBoundary } from "@/components/error-boundary"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { MobileNavigation } from "@/components/mobile-navigation"
import { DemoEnvironmentBanner } from "@/components/demo-environment-banner"
import { DemoModeProvider } from "@/lib/demo/context"
import { DemoDataInitializer } from "@/components/demo-data-initializer"
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Taxu",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#0066ff" />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <DemoModeProvider>
            <DemoEnvironmentBanner />
            <ConditionalNavigation />
            <DemoDataInitializer />
            {children}
            <TaxuChatWidget />
            <MobileNavigation />
            <PWAInstallPrompt />
          </DemoModeProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
