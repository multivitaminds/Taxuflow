export default function TotalGainLossPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Total Gain/Loss</h1>
        <p className="text-muted-foreground">All-time portfolio gains and losses</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">+$287,582.43 (+30.0%)</h2>
          <p className="text-muted-foreground">
            This is a detailed view of your total gains and losses. This page is under construction.
          </p>
        </div>
      </div>
    </div>
  )
}
