import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DeductionsPage() {
  const deductionTypes = [
    "Home office expenses",
    "Business mileage",
    "Equipment & software",
    "Professional development",
    "Health insurance premiums",
    "Retirement contributions",
    "Charitable donations",
    "Student loan interest",
    "Medical expenses",
    "State and local taxes",
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            AI <span className="text-glow">Deduction Finder</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Our AI analyzes your situation and finds every deduction you qualify for
          </p>
          <Link href="/get-started">
            <Button size="lg" className="glow-neon-strong">
              Find My Deductions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Brain className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Deductions We Find</h2>
            <p className="text-xl text-muted-foreground">Based on your income, expenses, and situation</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {deductionTypes.map((deduction, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="font-medium">{deduction}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
