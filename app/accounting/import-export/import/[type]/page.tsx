import ImportTypeClient from "./ImportTypeClient" // Assuming ImportTypeClient is a component in the same directory

export default async function ImportTypePage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params
  return (
    <div className="p-6">
      <ImportTypeClient type={resolvedParams.type} />
    </div>
  )
}
