import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function EnterprisePage() {
  const features = [
    "Multi-entity management",
    "Corporate tax returns (1120, 1120S)",
    "Partnership returns (1065)",
    "State nexus analysis",
    "R&D tax credit identification",
    "Dedicated account manager",
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Taxes for <span className="text-glow">Enterprise</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Comprehensive tax solutions for growing companies and corporations
          </p>
          <Link href="/contact">
            <Button size="lg" className="glow-neon-strong">
              Contact Sales
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Building className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Enterprise Features</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
