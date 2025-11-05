"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Loader2, Download, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface PenaltyAbatementDialogProps {
  businessName: string
  ein: string
  taxYear: number
  formType: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PenaltyAbatementDialog({
  businessName,
  ein,
  taxYear,
  formType,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: PenaltyAbatementDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [additionalContext, setAdditionalContext] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState("")

  const reasonOptions = [
    { value: "illness", label: "Serious illness or medical emergency" },
    { value: "death", label: "Death in family" },
    { value: "disaster", label: "Natural disaster or casualty" },
    { value: "records", label: "Loss of records due to circumstances beyond control" },
    { value: "advice", label: "Relied on incorrect advice from tax professional" },
    { value: "first-time", label: "First-time penalty and good compliance history" },
    { value: "system", label: "System or technical issues" },
    { value: "other", label: "Other reasonable cause" },
  ]

  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOnOpenChange || setInternalOpen

  const handleGenerate = async () => {
    if (!reason) {
      toast.error("Please select a reason for late filing")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-abatement-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          ein,
          taxYear,
          formType,
          reason: reasonOptions.find((r) => r.value === reason)?.label || reason,
          additionalContext,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate letter")
      }

      const data = await response.json()
      setGeneratedLetter(data.letter)

      toast.success("Penalty abatement letter generated!", {
        description: "Review and download your letter below",
      })
    } catch (error) {
      console.error("[v0] Letter generation error:", error)
      toast.error("Failed to generate letter", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `penalty-abatement-letter-${taxYear}-${formType}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Letter downloaded successfully")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Sparkles className="h-4 w-4" />
          Generate Penalty Abatement Letter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            AI Penalty Abatement Letter Generator
          </DialogTitle>
          <DialogDescription>
            Generate a professional IRS penalty abatement request letter. This premium feature uses AI to create a
            persuasive letter based on your specific circumstances.
          </DialogDescription>
        </DialogHeader>

        {!generatedLetter ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Late Filing *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Additional Context (Optional)</Label>
              <Textarea
                id="context"
                placeholder="Provide any additional details that support your reasonable cause argument..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                The more specific details you provide, the more persuasive your letter will be.
              </p>
            </div>

            <div className="rounded-lg border border-neon/20 bg-neon/5 p-4">
              <h4 className="font-semibold text-sm mb-2">What you'll get:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Professional IRS-ready letter format</li>
                <li>✓ References to IRC Section 6651 (reasonable cause)</li>
                <li>✓ Persuasive arguments tailored to your situation</li>
                <li>✓ Ready to print, sign, and mail</li>
              </ul>
            </div>

            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
              <p className="text-sm text-orange-600 dark:text-orange-400">
                <strong>Premium Feature:</strong> This service costs $39. The letter generation uses advanced AI and
                typically saves users hundreds or thousands in penalties.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="rounded-lg border bg-muted p-4">
              <pre className="text-sm whitespace-pre-wrap font-mono">{generatedLetter}</pre>
            </div>
          </div>
        )}

        <DialogFooter>
          {!generatedLetter ? (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating || !reason}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Letter ($39)
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setGeneratedLetter("")}>
                Generate Another
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Letter
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PenaltyAbatementDialog
