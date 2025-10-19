import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewExpensePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Expense</h1>
      <Card className="p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vendor</Label>
              <Input placeholder="Select vendor" />
            </div>
            <div>
              <Label>Expense Date</Label>
              <Input type="date" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input placeholder="Expense description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Input placeholder="Select category" />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>
          </div>
          <div>
            <Label>Receipt</Label>
            <Input type="file" accept="image/*,application/pdf" />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Add Expense</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
