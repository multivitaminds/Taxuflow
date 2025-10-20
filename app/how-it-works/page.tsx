import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Upload, MessageSquare, CheckCircle, Download, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Documents",
      description:
        "Drag and drop your W-2, 1099s, or other tax forms. Taxu's AI instantly reads and extracts all the data.",
      details: ["Supports all major tax forms", "OCR technology for instant scanning", "Secure encrypted upload"],
    },
    {
      number: "02",
      icon: MessageSquare,
      title: "Chat With Taxu",
      description: "Answer simple questions in plain English. No tax jargon. Just conversation.",
      details: ["Natural language processing", "Context-aware follow-ups", "Explains every question"],
    },
    {
      number: "03",
      icon: CheckCircle,
      title: "Review & Confirm",
      description: "See your complete return with AI explanations. Understand exactly where your refund comes from.",
      details: ["Line-by-line breakdown", "Deduction recommendations", "Audit risk assessment"],
    },
    {
      number: "04",
      icon: Download,
      title: "File Instantly",
      description: "One click to e-file with the IRS. Track your refund in real-time.",
      details: ["IRS e-file certified", "State filing included", "Refund tracking dashboard"],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Filing Made <span className="text-glow">Simple</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance">
            From upload to refund in 5 minutes. Here's exactly how it works.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-12 items-center`}
                >
                  <div className="flex-1">
                    <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
                      Step {step.number}
                    </div>
                    <h2 className="text-4xl font-bold mb-4">{step.title}</h2>
                    <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{step.description}</p>
                    <ul className="space-y-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className="rounded-2xl border border-border bg-card p-12 flex items-center justify-center glow-neon">
                      <Icon className="w-32 h-32 text-accent" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Visual Flow Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">The Complete Journey</h2>
            <p className="text-xl text-muted-foreground">From first upload to refund in your account</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {["Upload", "Chat", "Review", "File", "Refund"].map((label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center text-accent font-bold text-xl mb-4">
                  {index + 1}
                </div>
                <p className="font-semibold">{label}</p>
                {index < 4 && (
                  <ArrowRight className="w-6 h-6 text-accent mt-4 rotate-90 md:rotate-0 md:absolute md:mt-8 md:ml-20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Try It?</h2>
          <p className="text-xl text-muted-foreground mb-8">Start your free filing now. No credit card required.</p>
          <Link href="/get-started">
            <Button size="lg" className="glow-neon-strong">
              Start Filing Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
