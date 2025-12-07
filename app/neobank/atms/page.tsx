import { Suspense } from "react"
import { AtmLocatorEnhanced } from "@/components/neobank/atm-locator-enhanced"

export default function AtmsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading ATM locator...</div>}>
      <AtmLocatorEnhanced />
    </Suspense>
  )
}
