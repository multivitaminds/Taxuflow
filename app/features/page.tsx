import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, FileText, Shield, Zap, Calculator, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning finds every deduction and optimizes your return automatically",
    },
    {
      icon: FileText,
      title: "Smart Document Processing",
      description: "Upload any tax document and our OCR technology extracts all relevant data instantly",
    },
    {
      icon: Calculator,
      title: "Real-Time Calculations",
      description: "See your refund or tax owed update in real-time as you add information",
    },
    {
      icon: MessageSquare,
      title: "AI Tax Assistant",
      description: "Ask questions anytime and get instant answers from our AI tax expert",
    },
    {
      icon: Shield,
      title: "Audit Protection",
      description: "Comprehensive audit support with AI-powered risk assessment included free",
    },
    {
      icon: Zap,
      title: "Lightning Fast Filing",
      description: "Most returns completed in under 15 minutes with instant IRS e-file",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Features That <span className="text-glow">Work For You</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Everything you need to file taxes with confidence
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
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-8 hover:border-accent/50 hover:glow-neon transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
