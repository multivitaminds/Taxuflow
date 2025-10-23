import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Send, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function FilingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            AI-Powered <span className="text-glow">E-Filing</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Our AI prepares, reviews, and files your return with the IRS automatically
          </p>
          <Link href="/get-started">
            <Button size="lg" className="glow-neon-strong">
              Start Filing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Send className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">What Happens When You File</h2>
          </div>

          <div className="space-y-6">
            {[
              "AI reviews your return for errors and missing information",
              "Automatic compliance checking against current tax laws",
              "Direct e-file to IRS and state agencies",
              "Real-time filing status updates",
              "Confirmation receipts and tracking",
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <span className="text-lg">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
