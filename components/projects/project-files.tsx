"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"

interface ProjectFilesProps {
  projectId: string
}

export function ProjectFiles({ projectId }: ProjectFilesProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Project Files</h3>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No files uploaded yet</p>
        <p className="text-sm text-muted-foreground mt-1">Upload documents, images, and other project files</p>
      </div>
    </Card>
  )
}
