"use client"

import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  label: string
  sublabel?: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full border-4 transition-all duration-300",
                    isCompleted && "border-[#005ea2] bg-[#005ea2]",
                    isCurrent && "border-[#162e51] bg-[#162e51]",
                    isUpcoming && "border-gray-400 bg-white",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-8 w-8 text-white" strokeWidth={3} />
                  ) : (
                    <span
                      className={cn("text-2xl font-bold", isCurrent && "text-white", isUpcoming && "text-gray-600")}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-col items-center text-center">
                  <p
                    className={cn(
                      "font-semibold underline decoration-2 underline-offset-4",
                      isCurrent && "text-[#162e51] font-bold",
                      isCompleted && "text-[#005ea2]",
                      isUpcoming && "text-gray-600 no-underline",
                    )}
                  >
                    {step.label}
                  </p>
                  {step.sublabel && (
                    <p className={cn("text-sm mt-1", isCurrent || isCompleted ? "text-gray-700" : "text-gray-500")}>
                      {step.sublabel}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-1 w-24 transition-all duration-300",
                    stepNumber < currentStep ? "bg-[#005ea2]" : "bg-gray-300",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
