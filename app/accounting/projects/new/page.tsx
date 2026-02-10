import { ProjectFormClient } from "@/components/project-form-client"

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <ProjectFormClient />
    </div>
  )
}
