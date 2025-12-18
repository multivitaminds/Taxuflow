import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Activate Payments Account | Taxu",
  description: "Activate your Taxu live payments account",
}

export default function ActivatePaymentsRedirect() {
  redirect("/activate")
}
