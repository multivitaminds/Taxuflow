export default function PaymentsPage() {
  return <PaymentsClient />
}

function PaymentsClient() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Payments</h1>
      <p className="text-muted-foreground mt-2">Process and track customer payments</p>
    </div>
  )
}
