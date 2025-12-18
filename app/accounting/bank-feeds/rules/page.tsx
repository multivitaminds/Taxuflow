import RulesManagementClient from "./RulesManagementClient"

export default function RulesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorization Rules</h1>
        <p className="text-muted-foreground">Automate transaction categorization with custom rules</p>
      </div>
      <RulesManagementClient />
    </div>
  )
}
