"use client"

import { Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Wifi className="h-10 w-10 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">You're Offline</h1>
          <p className="text-gray-600 dark:text-gray-400">
            It looks like you've lost your internet connection. Some features may not be available.
          </p>
        </div>
        <div className="space-y-4">
          <Button onClick={() => window.location.reload()} className="w-full">
            Try Again
          </Button>
          <p className="text-sm text-gray-500">Cached data and recent pages are still available</p>
        </div>
      </div>
    </div>
  )
}
