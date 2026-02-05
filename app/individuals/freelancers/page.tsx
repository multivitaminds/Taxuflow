import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function FreelancersPage() {
  const features = [
    "1099-NEC and 1099-K support",
    "Automatic expense categorization",
    "Mileage tracking and deduction",
    "Home office deduction calculator",
    "Quarterly tax estimates",
    "Self-employment tax optimization",
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Taxes for <span className="text-glow">Freelancers</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Built specifically for independent contractors, consultants, and gig workers
          </p>
          <Link href="/get-started">
            <Button size="lg" className="glow-neon-strong">
              Start Filing Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Briefcase className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Everything Freelancers Need</h2>
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
