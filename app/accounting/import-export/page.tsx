import ImportExportClient from "./ImportExportClient" // Declare the ImportExportClient variable

export default function ImportExportPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Import & Export Center</h1>
        <p className="text-muted-foreground">Manage bulk data operations and exports</p>
      </div>
      <ImportExportClient />
    </div>
  )
}
