"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressStep {
  id: string
  title: string
  description: string
  icon: string
}

interface FilingProgressDialogProps {
  open: boolean
  currentStep: number
  steps: ProgressStep[]
  isComplete: boolean
  isError: boolean
}

export function FilingProgressDialog({ open, currentStep, steps, isComplete, isError }: FilingProgressDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl" hideCloseButton>
        <div className="py-8">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const stepNumber = index + 1
              const isActive = stepNumber === currentStep
              const isCompleted = stepNumber < currentStep || isComplete
              const isPending = stepNumber > currentStep

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-start gap-4 p-6 rounded-lg border-2 transition-all duration-300",
                    isActive && "bg-blue-50 border-blue-500 shadow-lg",
                    isCompleted && "bg-green-50 border-green-500",
                    isPending && "bg-gray-50 border-gray-300 opacity-50",
                  )}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                        <CheckCircle className="h-7 w-7 text-white" strokeWidth={3} />
                      </div>
                    ) : isActive ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                        <Loader2 className="h-7 w-7 text-white animate-spin" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold text-gray-600">
                        {step.icon}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3
                      className={cn(
                        "text-lg font-bold mb-1",
                        isActive && "text-blue-900",
                        isCompleted && "text-green-900",
                        isPending && "text-gray-600",
                      )}
                    >
                      Step {stepNumber} of {steps.length}: {step.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm",
                        isActive && "text-blue-800",
                        isCompleted && "text-green-800",
                        isPending && "text-gray-500",
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {isComplete && !isError && (
            <div className="mt-8 p-6 bg-green-50 border-2 border-green-500 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" strokeWidth={3} />
                <div>
                  <h3 className="text-xl font-bold text-green-900">Submission Complete!</h3>
                  <p className="text-green-800 mt-1">Your filing has been successfully submitted to the IRS.</p>
                </div>
              </div>
            </div>
          )}

          {isError && (
            <div className="mt-8 p-6 bg-red-50 border-2 border-red-500 rounded-lg">
              <h3 className="text-xl font-bold text-red-900">Submission Failed</h3>
              <p className="text-red-800 mt-1">
                There was an error processing your submission. Please try again or contact support.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
