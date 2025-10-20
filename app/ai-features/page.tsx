import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  TrendingUp,
  Shield,
  Calendar,
  Mic,
  Camera,
  Lightbulb,
  HeadphonesIcon,
  Sparkles,
  Brain,
  Zap,
  FileText,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function AIFeaturesPage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat-Powered Filing",
      description: "Just upload your W-2 and ask Taxu to file. Natural conversation, zero complexity.",
      benefits: [
        "Understands context from previous messages",
        "Asks clarifying questions when needed",
        "Explains every step in plain English",
      ],
    },
    {
      icon: TrendingUp,
      title: "Real-Time Refund Updates",
      description: "Watch your refund estimate update live as you add information.",
      benefits: ["Instant calculations as you type", "Shows impact of each deduction", "Compares to previous years"],
    },
    {
      icon: Shield,
      title: "Audit Risk Prediction",
      description: "AI-powered meter shows your audit risk score before you file.",
      benefits: ["Machine learning trained on IRS data", "Flags potential red flags", "Suggests safer alternatives"],
    },
    {
      icon: Calendar,
      title: "Tax Planning Calendar",
      description: "Year-round reminders for quarterly taxes, deductions, and deadlines.",
      benefits: [
        "Smart notifications based on your situation",
        "Integrates with Google/Apple Calendar",
        "Quarterly tax estimates for freelancers",
      ],
    },
    {
      icon: Sparkles,
      title: "Year-Round Assistant",
      description: "Not just April. Taxu helps you optimize taxes all year long.",
      benefits: ["Ask tax questions anytime", "Track deductible expenses monthly", "Get alerts for tax law changes"],
    },
    {
      icon: Mic,
      title: "Voice Assistant",
      description: "Talk to Taxu like a real tax advisor. Ask questions, get instant answers.",
      benefits: ["Natural voice recognition", "Hands-free filing option", "Multi-language support"],
    },
    {
      icon: Camera,
      title: "Receipt Scanner",
      description: "Snap photos of receipts. AI automatically categorizes and tracks deductions.",
      benefits: ["OCR technology extracts all data", "Auto-categorizes by expense type", "Cloud storage for 7 years"],
    },
    {
      icon: Lightbulb,
      title: "AI Explainer",
      description: "Understand exactly why you got this refund with plain-English breakdowns.",
      benefits: ["Line-by-line explanations", "Visual charts and graphs", "Compare scenarios side-by-side"],
    },
    {
      icon: HeadphonesIcon,
      title: "Live Tax Coaching",
      description: "Real-time guidance for small businesses and freelancers navigating complex situations.",
      benefits: [
        "Specialized advice for your industry",
        "Business expense optimization",
        "Entity structure recommendations",
      ],
    },
    {
      icon: Brain,
      title: "GPT-Style Conversations",
      description: '"I changed jobs mid-year, what should I do?" Taxu understands context and guides you.',
      benefits: [
        "Remembers your entire tax history",
        "Proactive suggestions based on life events",
        "Learns your preferences over time",
      ],
    },
    {
      icon: Zap,
      title: "Smart Deduction Finder",
      description: "AI scans your finances to find deductions you didn't know existed.",
      benefits: [
        "Connects to bank accounts (optional)",
        "Identifies missed opportunities",
        "Industry-specific deductions",
      ],
    },
    {
      icon: FileText,
      title: "Document Auto-Fill",
      description: "Upload once, never type again. AI remembers and pre-fills everything.",
      benefits: ["Carries forward from previous years", "Detects changes automatically", "Validates data accuracy"],
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-8">
            <Sparkles className="w-4 h-4" />
            Powered by GPT-4
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            AI Features That
            <br />
            <span className="text-glow">Actually Help</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance">
            Every feature designed to make taxes effortless. Built with the latest AI technology.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-8 hover:border-accent/50 hover:glow-neon transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-accent mt-1">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Built on Cutting-Edge AI</h2>
            <p className="text-xl text-muted-foreground">The same technology powering ChatGPT, fine-tuned for taxes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">GPT-4 Powered</h3>
              <p className="text-muted-foreground">Advanced language model trained on millions of tax scenarios</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">IRS Compliant</h3>
              <p className="text-muted-foreground">Every calculation verified against official IRS guidelines</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Always Learning</h3>
              <p className="text-muted-foreground">Continuously updated with new tax laws and regulations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Experience the Future of Filing</h2>
          <p className="text-xl text-muted-foreground mb-8">Try all AI features free. No credit card required.</p>
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
