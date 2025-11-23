import { Suspense } from "react"
import AdminLoginClient from "@/components/admin-login-client"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Admin Login - Taxu",
  description: "Sign in to the Taxu admin panel",
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <AdminLoginClient />
    </Suspense>
  )
}
