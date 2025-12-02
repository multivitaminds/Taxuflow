import { Suspense } from "react"
import { AtmLocator } from "@/components/neobank/atm-locator"

export default function AtmsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading ATM locator...</div>}>
      <AtmLocator />
    </Suspense>
  )
}
