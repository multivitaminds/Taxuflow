"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface JournalLine {
  id: string
  account: string
  description: string
  debit: string
  credit: string
}

export default function JournalEntryForm({ accountId }: { accountId: string }) {
  const router = useRouter()
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0])
  const [reference, setReference] = useState("")
  const [memo, setMemo] = useState("")
  const [lines, setLines] = useState<JournalLine[]>([
    { id: "1", account: "", description: "", debit: "", credit: "" },
    { id: "2", account: "", description: "", debit: "", credit: "" },
  ])

  const addLine = () => {
    setLines([...lines, { id: Date.now().toString(), account: "", description: "", debit: "", credit: "" }])
  }

  const removeLine = (id: string) => {
    if (lines.length > 2) {
      setLines(lines.filter((line) => line.id !== id))
    }
  }

  const updateLine = (id: string, field: keyof JournalLine, value: string) => {
    setLines(lines.map((line) => (line.id === id ? { ...line, [field]: value } : line)))
  }

  const totalDebit = lines.reduce((sum, line) => sum + (Number.parseFloat(line.debit) || 0), 0)
  const totalCredit = lines.reduce((sum, line) => sum + (Number.parseFloat(line.credit) || 0), 0)
  const isBalanced = totalDebit === totalCredit && totalDebit > 0

  const handleSave = () => {
    if (isBalanced) {
      // Save logic here
      router.push(`/accounting/chart-of-accounts/${accountId}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/accounting/chart-of-accounts/${accountId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label>Entry Date</Label>
            <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
          </div>
          <div>
            <Label>Reference Number</Label>
            <Input placeholder="JE-001" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
          <div>
            <Label>Memo</Label>
            <Input placeholder="Description of entry..." value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Account</th>
                <th className="text-left p-4 font-medium">Description</th>
                <th className="text-right p-4 font-medium">Debit</th>
                <th className="text-right p-4 font-medium">Credit</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-t">
                  <td className="p-2">
                    <Input
                      placeholder="Select account..."
                      value={line.account}
                      onChange={(e) => updateLine(line.id, "account", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      placeholder="Description..."
                      value={line.description}
                      onChange={(e) => updateLine(line.id, "description", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={line.debit}
                      onChange={(e) => updateLine(line.id, "debit", e.target.value)}
                      className="text-right"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={line.credit}
                      onChange={(e) => updateLine(line.id, "credit", e.target.value)}
                      className="text-right"
                    />
                  </td>
                  <td className="p-2">
                    <Button variant="ghost" size="sm" onClick={() => removeLine(line.id)} disabled={lines.length <= 2}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/50 border-t-2">
              <tr>
                <td colSpan={2} className="p-4 font-semibold">
                  Totals
                </td>
                <td className="p-4 text-right font-bold">${totalDebit.toFixed(2)}</td>
                <td className="p-4 text-right font-bold">${totalCredit.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={addLine}>
            <Plus className="h-4 w-4 mr-2" />
            Add Line
          </Button>

          <div className="flex items-center gap-4">
            {!isBalanced && totalDebit + totalCredit > 0 && (
              <p className="text-sm text-red-600 font-medium">Entry must balance (Debit = Credit)</p>
            )}
            <Button onClick={handleSave} disabled={!isBalanced}>
              <Save className="h-4 w-4 mr-2" />
              Save Entry
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
