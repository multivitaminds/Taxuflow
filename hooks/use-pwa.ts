"use client"

import { useState, useEffect } from "react"

interface PWAStatus {
  isInstalled: boolean
  isStandalone: boolean
  canInstall: boolean
  isOnline: boolean
}

export function usePWA() {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    isOnline: true,
  })

  useEffect(() => {
    // Check if running as PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true

    // Check if already installed
    const isInstalled = localStorage.getItem("pwa-installed") === "true"

    // Update status
    setStatus((prev) => ({
      ...prev,
      isInstalled,
      isStandalone,
      isOnline: navigator.onLine,
    }))

    // Listen for install success
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("pwa-installed", "true")
      setStatus((prev) => ({ ...prev, isInstalled: true }))
    })

    // Listen for online/offline changes
    const handleOnline = () => setStatus((prev) => ({ ...prev, isOnline: true }))
    const handleOffline = () => setStatus((prev) => ({ ...prev, isOnline: false }))

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration)
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    }
  }, [])

  return status
}
