"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Loader2, XCircle, Clock } from 'lucide-react'
import type { UploadProgress } from "@/lib/upload-progress-tracker"

interface UploadProgressDisplayProps {
  progress: UploadProgress
}

export function UploadProgressDisplay({ progress }: UploadProgressDisplayProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <Card className="p-6 border-border">
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Upload Progress</h3>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress.overallProgress)}%
          </span>
        </div>
        <Progress value={progress.overallProgress} className="h-3" />
        {progress.estimatedTimeRemaining && (
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Estimated time remaining: {formatTime(progress.estimatedTimeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Stages */}
      <div className="space-y-4 mb-6">
        {progress.stages.map((stage, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-3">
              {getStageIcon(stage.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{stage.name}</span>
                  {stage.status === "in-progress" && (
                    <span className="text-xs text-muted-foreground">{Math.round(stage.progress)}%</span>
                  )}
                </div>
                {stage.message && <p className="text-xs text-muted-foreground mt-1">{stage.message}</p>}
                {stage.error && <p className="text-xs text-red-500 mt-1">{stage.error}</p>}
              </div>
            </div>
            {stage.status === "in-progress" && (
              <Progress value={stage.progress} className="h-1.5 ml-8" />
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{progress.totalRecords}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-500">{progress.processedRecords}</p>
          <p className="text-xs text-muted-foreground">Processed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">{progress.successfulRecords}</p>
          <p className="text-xs text-muted-foreground">Success</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">{progress.failedRecords}</p>
          <p className="text-xs text-muted-foreground">Failed</p>
        </div>
      </div>
    </Card>
  )
}
