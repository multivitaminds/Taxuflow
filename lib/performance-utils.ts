"use client"

import React from "react"

// Performance monitoring utilities

export function measurePageLoad() {
  if (typeof window !== "undefined" && window.performance) {
    const perfData = window.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    console.log("[v0] Page load time:", pageLoadTime, "ms")
    return pageLoadTime
  }
}

export function measureComponentRender(componentName: string) {
  return {
    start: () => {
      if (typeof window !== "undefined" && window.performance) {
        window.performance.mark(`${componentName}-start`)
      }
    },
    end: () => {
      if (typeof window !== "undefined" && window.performance) {
        window.performance.mark(`${componentName}-end`)
        window.performance.measure(componentName, `${componentName}-start`, `${componentName}-end`)
        const measure = window.performance.getEntriesByName(componentName)[0]
        console.log(`[v0] ${componentName} render time:`, measure.duration, "ms")
      }
    },
  }
}

// Lazy load images
export function lazyLoadImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = React.useState(placeholder || "")
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setImageSrc(src)
          observer.disconnect()
        }
      })
    })

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [src])

  return { imageSrc, imgRef }
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Memoization helper
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map()
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}
