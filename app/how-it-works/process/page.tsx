import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Brain, FileCheck, Send, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ProcessPage() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Drag and drop your W-2s, 1099s, receipts, and other tax documents",
      details: [
        "Supports PDF, JPG, PNG formats",
        "Bulk upload multiple files",
        "Automatic document type detection",
        "Secure encrypted storage",
      ],
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our AI extracts data, finds deductions, and optimizes your return",
      details: [
        "OCR technology reads all documents",
        "Smart deduction discovery",
        "Error detection and correction",
        "Tax law compliance checking",
      ],
    },
    {
      icon: FileCheck,
      title: "Review & Approve",
      description: "Review your return, ask questions, and make any adjustments",
      details: [
        "Plain English explanations",
        "Line-by-line breakdown",
        "Chat with AI tax assistant",
        "Unlimited revisions",
      ],
    },
    {
      icon: Send,
      title: "E-File",
      description: "We file directly with the IRS and state agencies",
      details: ["IRS-certified e-file provider", "Real-time filing status", "Refund tracking", "Confirmation receipts"],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            How <span className="text-glow">Taxu Works</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            From upload to e-file in minutes. Our AI handles the complexity while you stay in control.
          </p>
          <Link href="/get-started">
            <Button size="lg" className="glow-neon-strong">
              Start Filing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="grid md:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <span className="text-sm font-semibold text-accent">Step {index + 1}</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">{step.title}</h2>
                    <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{step.description}</p>
                    <ul className="space-y-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <div className="rounded-2xl border border-border bg-card p-8 glow-neon">
                      <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="w-32 h-32 text-accent/30" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Average Filing Time</h2>
            <p className="text-xl text-muted-foreground">Most users complete their return in under 15 minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-8 rounded-2xl border border-border bg-card">
              <div className="text-5xl font-bold text-accent mb-2">5 min</div>
              <div className="text-sm text-muted-foreground">Document Upload</div>
            </div>
            <div className="text-center p-8 rounded-2xl border border-border bg-card">
              <div className="text-5xl font-bold text-accent mb-2">8 min</div>
              <div className="text-sm text-muted-foreground">AI Processing & Review</div>
            </div>
            <div className="text-center p-8 rounded-2xl border border-border bg-card">
              <div className="text-5xl font-bold text-accent mb-2">2 min</div>
              <div className="text-sm text-muted-foreground">E-File Submission</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Experience It?</h2>
          <p className="text-xl text-muted-foreground mb-8">Start your return now and see how simple taxes can be</p>
          <Link href="/get-started">
            <Button size="lg" className="glow-neon-strong">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
