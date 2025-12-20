import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProjectDetailClient from "./ProjectDetailClient"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <ProjectDetailClient projectId={resolvedParams.id} user={user} />
}
