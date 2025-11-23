"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function AutoFileButton() {
  const [filing, setFiling] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAutoFile = async () => {
    setFiling(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/auto-file", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Filing failed")
      }

      setResult(data)

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setFiling(false)
    }
  }

  if (result) {
    return (
      <Card className="p-6 bg-green-500/10 border-green-500">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-500 mb-2">Filing Complete!</h3>
            <p className="text-sm text-muted-foreground mb-3">Your taxes have been filed successfully with the IRS.</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submission ID:</span>
                <span className="font-mono">{result.submissionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Refund/Owed:</span>
                <span className={`font-semibold ${result.refundOrOwed >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {result.refundOrOwed >= 0 ? "+" : ""}${Math.abs(result.refundOrOwed).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 border-destructive">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-destructive mb-2">Filing Failed</h3>
            <p className="text-sm text-muted-foreground mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={() => setError(null)}>
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Button onClick={handleAutoFile} disabled={filing} size="lg" className="w-full">
      {filing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Filing your taxes...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Auto-File My Taxes
        </>
      )}
    </Button>
  )
}
