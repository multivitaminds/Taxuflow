"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-black px-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-500/10 p-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">Critical Error</h1>
              <p className="text-gray-400">
                A critical error occurred. Please refresh the page or contact support if the problem persists.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={reset} variant="default">
                Try again
              </Button>
              <Button onClick={() => (window.location.href = "/")} variant="outline">
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
