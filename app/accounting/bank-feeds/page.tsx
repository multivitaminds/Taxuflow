import BankFeedsClient from "./BankFeedsClient"

export default function BankFeedsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bank Feeds</h1>
        <p className="text-muted-foreground">Connect your bank accounts and automatically import transactions</p>
      </div>
      <BankFeedsClient />
    </div>
  )
}
