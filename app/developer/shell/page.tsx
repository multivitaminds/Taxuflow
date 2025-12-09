import { Suspense } from "react"
import { DeveloperShell } from "@/components/developer/developer-shell"

export const metadata = {
  title: "Taxu Shell - Interactive API Testing | Taxu Developer",
  description: "Test Taxu APIs directly in your browser with our interactive shell and API explorer",
}

export default function ShellPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <DeveloperShell />
      </Suspense>
    </div>
  )
}
