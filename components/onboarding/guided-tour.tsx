"use client"

import { useState, useEffect } from "react"
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface TourStep {
  target: string
  title: string
  description: string
  position?: "top" | "bottom" | "left" | "right"
}

interface GuidedTourProps {
  steps: TourStep[]
  onComplete: () => void
  tourKey: string
}

export function GuidedTour({ steps, onComplete, tourKey }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`tour_${tourKey}_completed`)
    if (!hasSeenTour) {
      setIsVisible(true)
      updatePosition()
    }
  }, [tourKey])

  useEffect(() => {
    if (isVisible) {
      updatePosition()
    }
  }, [currentStep, isVisible])

  const updatePosition = () => {
    const step = steps[currentStep]
    const element = document.querySelector(step.target)
    if (element) {
      const rect = element.getBoundingClientRect()
      const position = step.position || "bottom"

      let top = 0
      let left = 0

      switch (position) {
        case "top":
          top = rect.top - 150
          left = rect.left + rect.width / 2 - 200
          break
        case "bottom":
          top = rect.bottom + 10
          left = rect.left + rect.width / 2 - 200
          break
        case "left":
          top = rect.top + rect.height / 2 - 75
          left = rect.left - 420
          break
        case "right":
          top = rect.top + rect.height / 2 - 75
          left = rect.right + 20
          break
      }

      setPosition({ top, left })

      // Highlight the target element
      element.classList.add("ring-2", "ring-primary", "ring-offset-2")

      return () => {
        element.classList.remove("ring-2", "ring-primary", "ring-offset-2")
      }
    }
  }

  const handleNext = () => {
    const currentElement = document.querySelector(steps[currentStep].target)
    if (currentElement) {
      currentElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    const currentElement = document.querySelector(steps[currentStep].target)
    if (currentElement) {
      currentElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem(`tour_${tourKey}_completed`, "true")
    setIsVisible(false)
    onComplete()
  }

  const handleSkip = () => {
    const currentElement = document.querySelector(steps[currentStep].target)
    if (currentElement) {
      currentElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
    }
    handleComplete()
  }

  if (!isVisible) return null

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* Tour Card */}
      <Card className="fixed z-[9999] w-[400px] p-6 shadow-2xl" style={{ top: position.top, left: position.left }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSkip}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handlePrevious} disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip Tour
            </Button>
            <Button size="sm" onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}
