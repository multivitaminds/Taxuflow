import { DemoModeBanner } from "@/components/demo-mode-banner"
import { GoalsClient } from "@/components/neobank/goals-client"

export const metadata = {
  title: "Financial Goals | Taxu Banking",
}

export default function GoalsPage() {
  return (
    <>
      <DemoModeBanner />
      <GoalsClient />
    </>
  )
}
