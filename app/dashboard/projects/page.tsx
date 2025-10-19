import { Suspense } from "react"
import { ProjectManagementDashboard } from "@/components/projects/project-management-dashboard"

export default function ProjectsPage() {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectManagementDashboard />
      </Suspense>
    </div>
  )
}
