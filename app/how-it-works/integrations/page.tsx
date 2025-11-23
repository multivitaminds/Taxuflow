import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Plug } from "lucide-react"

export default function IntegrationsPage() {
  const integrations = [
    { name: "QuickBooks", category: "Accounting" },
    { name: "Xero", category: "Accounting" },
    { name: "Stripe", category: "Payments" },
    { name: "PayPal", category: "Payments" },
    { name: "Gusto", category: "Payroll" },
    { name: "ADP", category: "Payroll" },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            <span className="text-glow">Integrations</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Connect your existing tools for seamless tax management
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-border bg-card hover:border-accent/50 transition-colors"
              >
                <Plug className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">{integration.name}</h3>
                <p className="text-muted-foreground text-sm">{integration.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
