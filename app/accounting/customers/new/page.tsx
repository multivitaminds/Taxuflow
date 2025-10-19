import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewCustomerPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Customer</h1>
      <Card className="p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Customer Name</Label>
              <Input placeholder="John Doe" />
            </div>
            <div>
              <Label>Company</Label>
              <Input placeholder="Acme Corp" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="john@example.com" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input type="tel" placeholder="(555) 123-4567" />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input placeholder="123 Main St, City, State 12345" />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Add Customer</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
