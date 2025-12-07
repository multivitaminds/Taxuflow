"use client"

import type React from "react"

interface NeobankLayoutProps {
  children: React.ReactNode
}

export function NeobankLayout({ children }: NeobankLayoutProps) {
  return <div className="min-h-screen">{children}</div>
}
