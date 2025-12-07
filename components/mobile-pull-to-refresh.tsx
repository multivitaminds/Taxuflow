"use client"

import { type ReactNode, useState, useEffect, useRef } from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  threshold?: number
}

export function MobilePullToRefresh({ onRefresh, children, threshold = 80 }: MobilePullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (startY === 0 || window.scrollY > 0 || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY)

    if (distance > 0) {
      e.preventDefault()
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    setPullDistance(0)
    setStartY(0)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [startY, pullDistance, isRefreshing])

  const rotation = (pullDistance / threshold) * 360
  const opacity = Math.min(pullDistance / threshold, 1)

  return (
    <div ref={containerRef} className="relative pull-to-refresh-area">
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all"
        style={{
          height: pullDistance,
          opacity,
        }}
      >
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full bg-primary/10",
            isRefreshing && "animate-spin",
          )}
        >
          <RefreshCw className="h-5 w-5 text-primary" style={{ transform: `rotate(${rotation}deg)` }} />
        </div>
      </div>
      <div style={{ transform: `translateY(${pullDistance}px)`, transition: isRefreshing ? "transform 0.3s" : "none" }}>
        {children}
      </div>
    </div>
  )
}
