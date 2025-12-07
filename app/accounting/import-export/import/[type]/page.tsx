import ImportTypeClient from "./ImportTypeClient" // Assuming ImportTypeClient is a component in the same directory

export default function ImportTypePage({ params }: { params: { type: string } }) {
  return (
    <div className="p-6">
      <ImportTypeClient type={params.type} />
    </div>
  )
}
