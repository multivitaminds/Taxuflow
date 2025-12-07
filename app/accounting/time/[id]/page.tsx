import TimeEntryDetailClient from "./TimeEntryDetailClient"

export default async function TimeEntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div>
      <TimeEntryDetailClient entryId={id} />
    </div>
  )
}
