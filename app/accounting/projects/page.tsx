import { Suspense } from "react"
import ProjectsClient from "@/components/projects-client"

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading projects...</div>}>
      <ProjectsClient />
    </Suspense>
  )
}
