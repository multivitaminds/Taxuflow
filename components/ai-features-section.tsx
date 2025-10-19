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
} from "lucide-react"

export function AIFeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat-Powered Filing",
      description: "Just upload your W-2 and ask Taxu to file. Natural conversation, zero complexity.",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Refund Updates",
      description: "Watch your refund estimate update live as you add information.",
    },
    {
      icon: Shield,
      title: "Audit Risk Prediction",
      description: "AI-powered meter shows your audit risk score before you file.",
    },
    {
      icon: Calendar,
      title: "Tax Planning Calendar",
      description: "Year-round reminders for quarterly taxes, deductions, and deadlines.",
    },
    {
      icon: Sparkles,
      title: "Year-Round Assistant",
      description: "Not just April. Taxu helps you optimize taxes all year long.",
    },
    {
      icon: Mic,
      title: "Voice Assistant",
      description: "Talk to Taxu like a real tax advisor. Ask questions, get instant answers.",
    },
    {
      icon: Camera,
      title: "Receipt Scanner",
      description: "Snap photos of receipts. AI automatically categorizes and tracks deductions.",
    },
    {
      icon: Lightbulb,
      title: "AI Explainer",
      description: "Understand exactly why you got this refund with plain-English breakdowns.",
    },
    {
      icon: HeadphonesIcon,
      title: "Live Tax Coaching",
      description: "Real-time guidance for small businesses and freelancers navigating complex situations.",
    },
    {
      icon: Brain,
      title: "GPT-Style Conversations",
      description: '"I changed jobs mid-year, what should I do?" Taxu understands context and guides you.',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">AI Features That Actually Help</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powered by GPT-4, built for humans. Every feature designed to make taxes effortless.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-accent/50 hover:glow-neon transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
