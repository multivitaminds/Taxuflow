import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TaxOptimizerClient } from "@/components/tax-optimizer-client"
import { analyzeTaxOptimizations } from "@/lib/tax/optimization-engine"

export default async function TaxOptimizerPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get tax optimizations
  const optimizations = await analyzeTaxOptimizations(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Suspense fallback={<div>Loading...</div>}>
        <TaxOptimizerClient optimizations={optimizations} />
      </Suspense>
    </div>
  )
}
