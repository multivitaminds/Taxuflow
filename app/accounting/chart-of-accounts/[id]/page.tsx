import { Suspense } from "react"
import AccountDetailClient from "./AccountDetailClient"

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="p-8">
      <Suspense fallback={<div>Loading account details...</div>}>
        <AccountDetailClient accountId={id} />
      </Suspense>
    </div>
  )
}
