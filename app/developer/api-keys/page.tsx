import { Suspense } from "react"
import { ApiKeysClient } from "@/components/developer/api-keys-client"

export default function ApiKeysPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Keys</h1>
        <p className="text-muted-foreground text-lg">
          Manage your API keys for authenticating requests to the Taxu API
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <ApiKeysClient />
      </Suspense>
    </div>
  )
}
