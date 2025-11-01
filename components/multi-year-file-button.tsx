"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface AvailableYear {
  year: number
  documentCount: number
  estimatedRefund: number
}

interface MultiYearFileButtonProps {
  availableYears: AvailableYear[]
}

export function MultiYearFileButton({ availableYears }: MultiYearFileButtonProps) {
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [filing, setFiling] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleYearToggle = (year: number) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]))
  }

  const handleFileMultiYear = async () => {
    if (selectedYears.length === 0) {
      setError("Please select at least one tax year")
      return
    }

    setFiling(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/auto-file-multi-year", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taxYears: selectedYears }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Filing failed")
      }

      setResult(data)

      // Redirect to dashboard after 5 seconds
      setTimeout(() => {
        router.push("/dashboard/filing")
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setFiling(false)
    }
  }

  const totalEstimatedRefund = availableYears
    .filter((y) => selectedYears.includes(y.year))
    .reduce((sum, y) => sum + y.estimatedRefund, 0)

  if (result) {
    return (
      <Card className="p-6 bg-green-500/10 border-green-500">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-500 mb-2">Multi-Year Filing Complete!</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Successfully filed {result.summary.successfulFilings} of {result.summary.totalYears} tax years.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Refund:</span>
                <span className="font-semibold text-green-500">${result.summary.totalRefund.toFixed(2)}</span>
              </div>
              {result.results.map((r: any) => (
                <div key={r.taxYear} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{r.taxYear}:</span>
                  {r.success ? (
                    <span className="text-green-500 text-xs">✓ Filed</span>
                  ) : (
                    <span className="text-red-500 text-xs">✗ {r.error}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)} size="lg" className="w-full">
        <Calendar className="mr-2 h-5 w-5" />
        File Multiple Years
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 border-neon/20 bg-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">File Multiple Tax Years</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                ✕
              </Button>
            </div>

            {error && (
              <Card className="p-4 mb-6 bg-red-500/10 border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              </Card>
            )}

            <div className="space-y-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Select the tax years you want to file. We'll process them all at once.
              </p>

              {availableYears.map((yearData) => (
                <Card
                  key={yearData.year}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedYears.includes(yearData.year)
                      ? "border-neon/40 bg-neon/5"
                      : "border-border hover:border-neon/20"
                  }`}
                  onClick={() => handleYearToggle(yearData.year)}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedYears.includes(yearData.year)}
                      onCheckedChange={() => handleYearToggle(yearData.year)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Tax Year {yearData.year}</h3>
                          <p className="text-sm text-muted-foreground">
                            {yearData.documentCount} document{yearData.documentCount !== 1 ? "s" : ""} ready
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-500">${yearData.estimatedRefund.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Est. refund</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedYears.length > 0 && (
              <Card className="p-4 mb-6 bg-neon/5 border-neon/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Estimated Refund</p>
                    <p className="text-2xl font-bold text-neon">${totalEstimatedRefund.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Filing {selectedYears.length} year{selectedYears.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleFileMultiYear}
                disabled={filing || selectedYears.length === 0}
                className="flex-1 bg-neon hover:bg-neon/90 text-background"
              >
                {filing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Filing {selectedYears.length} year{selectedYears.length !== 1 ? "s" : ""}...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    File All Selected Years
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
