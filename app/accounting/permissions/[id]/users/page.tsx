import { Suspense } from "react"
import { RoleUsersClient } from "@/components/role-users-client"

export default function RoleUsersPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <RoleUsersClient />
    </Suspense>
  )
}
