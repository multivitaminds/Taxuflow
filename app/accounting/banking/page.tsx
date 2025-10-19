import { Suspense } from "react"
import BankingClient from "@/components/banking-client"

export default function BankingPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading banking...</div>}>
      <BankingClient />
    </Suspense>
  )
}
