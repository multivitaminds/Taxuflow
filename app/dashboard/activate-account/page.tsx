import { getUser } from "@/app/actions/get-user"
import { getUserProfile } from "@/app/actions/get-user-profile"
import { redirect } from "next/navigation"
import { ActivateAccountClient } from "@/components/activate-account-client"

export default async function ActivateAccountPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await getUserProfile()

  return <ActivateAccountClient user={user} profile={profile} />
}
