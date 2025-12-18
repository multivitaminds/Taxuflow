import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plug, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function XeroPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            <span className="text-glow">Xero</span> Integration
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Connect your Xero account for automatic tax data synchronization
          </p>
          <Link href="/accounting">
            <Button size="lg" className="glow-neon-strong">
              Connect Xero
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Plug className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">What Gets Synced</h2>
          </div>

          <div className="space-y-4">
            {[
              "Bank transactions and reconciliations",
              "Invoices and bills",
              "Contacts and suppliers",
              "Tax rates and codes",
              "Financial reports",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
