import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LogsClient } from "@/components/logs-client"

export default function LogsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-20">
        <LogsClient />
      </div>
      <Footer />
    </main>
  )
}
