import { FileText, Sparkles, DollarSign, MessageSquare } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "W‑2 / 1099 Upload & Parsing",
    description: "OCR + instant extraction. Just snap a photo and let AI handle the rest.",
  },
  {
    icon: Sparkles,
    title: "Auto-fill 1040",
    description: "AI does the heavy lifting. Your return is filled out in minutes, not hours.",
  },
  {
    icon: DollarSign,
    title: "Refund Estimator",
    description: "Live updates, transparent calculation. Know your refund before you file.",
  },
  {
    icon: MessageSquare,
    title: "Chat-Guided Filing",
    description: 'Just ask "Am I getting a refund?" Natural conversation, expert results.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-background-alt">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Built for Simplicity, Powered by AI
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border bg-card p-8 hover:border-accent/50 transition-all duration-300"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-balance">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-balance">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
