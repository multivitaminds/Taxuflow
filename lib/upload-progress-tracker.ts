export interface UploadStage {
  name: string
  status: "pending" | "in-progress" | "completed" | "error"
  progress: number
  message?: string
  error?: string
}

export interface UploadProgress {
  stages: UploadStage[]
  currentStage: number
  overallProgress: number
  totalRecords: number
  processedRecords: number
  successfulRecords: number
  failedRecords: number
  startTime: number
  estimatedTimeRemaining?: number
}

export class UploadProgressTracker {
  private progress: UploadProgress
  private listeners: Array<(progress: UploadProgress) => void> = []

  constructor(totalRecords: number) {
    this.progress = {
      stages: [
        { name: "Parsing File", status: "pending", progress: 0 },
        { name: "Cleaning Data", status: "pending", progress: 0 },
        { name: "Validating Records", status: "pending", progress: 0 },
        { name: "Checking Duplicates", status: "pending", progress: 0 },
        { name: "Uploading to Database", status: "pending", progress: 0 },
      ],
      currentStage: 0,
      overallProgress: 0,
      totalRecords,
      processedRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      startTime: Date.now(),
    }
  }

  subscribe(listener: (progress: UploadProgress) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.progress }))
  }

  startStage(stageIndex: number, message?: string) {
    this.progress.currentStage = stageIndex
    this.progress.stages[stageIndex].status = "in-progress"
    this.progress.stages[stageIndex].progress = 0
    if (message) {
      this.progress.stages[stageIndex].message = message
    }
    this.updateOverallProgress()
    this.notify()
  }

  updateStageProgress(stageIndex: number, progress: number, message?: string) {
    this.progress.stages[stageIndex].progress = Math.min(100, Math.max(0, progress))
    if (message) {
      this.progress.stages[stageIndex].message = message
    }
    this.updateOverallProgress()
    this.notify()
  }

  completeStage(stageIndex: number, message?: string) {
    this.progress.stages[stageIndex].status = "completed"
    this.progress.stages[stageIndex].progress = 100
    if (message) {
      this.progress.stages[stageIndex].message = message
    }
    this.updateOverallProgress()
    this.notify()
  }

  errorStage(stageIndex: number, error: string) {
    this.progress.stages[stageIndex].status = "error"
    this.progress.stages[stageIndex].error = error
    this.updateOverallProgress()
    this.notify()
  }

  updateRecordProgress(processed: number, successful: number, failed: number) {
    this.progress.processedRecords = processed
    this.progress.successfulRecords = successful
    this.progress.failedRecords = failed
    this.updateEstimatedTime()
    this.notify()
  }

  private updateOverallProgress() {
    const totalStages = this.progress.stages.length
    const completedStages = this.progress.stages.filter((s) => s.status === "completed").length
    const currentStageProgress = this.progress.stages[this.progress.currentStage]?.progress || 0

    this.progress.overallProgress = ((completedStages + currentStageProgress / 100) / totalStages) * 100
  }

  private updateEstimatedTime() {
    const elapsed = Date.now() - this.progress.startTime
    const processedRecords = this.progress.processedRecords

    if (processedRecords > 0) {
      const timePerRecord = elapsed / processedRecords
      const remainingRecords = this.progress.totalRecords - processedRecords
      this.progress.estimatedTimeRemaining = Math.ceil(timePerRecord * remainingRecords)
    }
  }

  getProgress(): UploadProgress {
    return { ...this.progress }
  }
}
