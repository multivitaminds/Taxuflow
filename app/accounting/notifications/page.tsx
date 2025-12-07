import { Suspense } from "react"
import NotificationsClient from "./NotificationsClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div>Loading notifications...</div>}>
      <NotificationsClient />
    </Suspense>
  )
}
