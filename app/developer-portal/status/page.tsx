import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StatusClient } from "@/components/status-client"

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-20">
        <StatusClient />
      </div>
      <Footer />
    </main>
  )
}
