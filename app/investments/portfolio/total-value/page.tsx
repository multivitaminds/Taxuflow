export default function TotalValuePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Total Portfolio Value</h1>
        <p className="text-muted-foreground">Detailed breakdown of your total portfolio value</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">$1,247,582.43</h2>
          <p className="text-muted-foreground">
            This is a detailed view of your total portfolio value. This page is under construction.
          </p>
        </div>
      </div>
    </div>
  )
}
