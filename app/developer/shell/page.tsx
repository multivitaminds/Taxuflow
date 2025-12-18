import { Suspense } from "react"
import { TaxuWorkbench } from "@/components/developer/taxu-workbench"

export const metadata = {
  title: "Taxu Workbench - Interactive Developer Platform | Taxu",
  description:
    "Enterprise-grade developer workbench combining API testing and interactive shell for Tax-filing, Banking, Accounting, and Investment operations",
}

export default function ShellPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent mb-4" />
              <div className="text-gray-400">Loading Taxu Workbench...</div>
            </div>
          </div>
        }
      >
        <TaxuWorkbench />
      </Suspense>
    </div>
  )
}
