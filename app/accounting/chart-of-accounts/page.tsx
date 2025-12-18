import ChartOfAccountsClient from "./ChartOfAccountsClient"

export default function ChartOfAccountsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chart of Accounts</h1>
        <p className="text-muted-foreground">Manage your complete accounting structure</p>
      </div>
      <ChartOfAccountsClient />
    </div>
  )
}
