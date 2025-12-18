import { Suspense } from "react"
import { UserRolesClient } from "@/components/user-roles-client"

export default function UserRolesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <UserRolesClient />
    </Suspense>
  )
}
