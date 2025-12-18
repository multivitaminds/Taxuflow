import JournalEntryForm from "./JournalEntryForm"

export default async function NewJournalEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">New Journal Entry</h1>
        <p className="text-muted-foreground">Create a new journal entry for this account</p>
      </div>
      <JournalEntryForm accountId={id} />
    </div>
  )
}
