import ReconciliationClient from "./ReconciliationClient"

export default function ReconciliationPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bank Reconciliation</h1>
        <p className="text-muted-foreground">Match bank transactions with your accounting records</p>
      </div>
      <ReconciliationClient />
    </div>
  )
}
