export default function TimeTrackingPage() {
  return <TimeTrackingClient />
}

function TimeTrackingClient() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Time Tracking</h1>
      <p className="text-muted-foreground mt-2">Track billable hours and project time</p>
    </div>
  )
}
