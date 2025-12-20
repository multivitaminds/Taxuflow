import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { KeySettingsClient } from "@/components/key-settings-client"

export default async function KeySettingsPage({ params }: { params: Promise<{ keyId: string }> }) {
  const resolvedParams = await params
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-20">
        <KeySettingsClient keyId={resolvedParams.keyId} />
      </div>
      <Footer />
    </main>
  )
}
