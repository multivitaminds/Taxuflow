export default function SettingsPage() {
  return <SettingsClient />
}

function SettingsClient() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Accounting Settings</h1>
      <p className="text-muted-foreground mt-2">Configure your accounting preferences</p>
    </div>
  )
}
