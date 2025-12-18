"use client"

import type React from "react"

import { type ReactNode, useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  snapPoints?: number[]
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
}: MobileBottomSheetProps) {
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [snapPoint, setSnapPoint] = useState(snapPoints[0])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const delta = currentY - dragY

    if (delta > 0) {
      setDragY(currentY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    const threshold = window.innerHeight * 0.2

    if (dragY > threshold) {
      onClose()
    }
    setDragY(0)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0" onClick={onClose} />
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl",
          "animate-in slide-in-from-bottom-full duration-300",
        )}
        style={{
          height: `${snapPoint * 100}vh`,
          transform: `translateY(${Math.max(0, dragY)}px)`,
        }}
      >
        <div
          className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing touch-manipulation"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {title && (
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="touch-manipulation">
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="overflow-y-auto scroll-smooth-mobile" style={{ height: "calc(100% - 80px)" }}>
          {children}
        </div>
      </div>
    </>
  )
}
