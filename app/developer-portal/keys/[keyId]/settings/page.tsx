import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { KeySettingsClient } from "@/components/key-settings-client"

export default function KeySettingsPage({ params }: { params: { keyId: string } }) {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-20">
        <KeySettingsClient keyId={params.keyId} />
      </div>
      <Footer />
    </main>
  )
}
