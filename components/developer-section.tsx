import { Code2, Webhook, Puzzle, Box, TestTube } from "lucide-react"

const features = [
  {
    icon: Code2,
    title: "Public REST API",
    description: "Full-featured API for tax calculations and filing",
  },
  {
    icon: Webhook,
    title: "Webhooks for return status",
    description: "Real-time updates on filing progress",
  },
  {
    icon: Box,
    title: "Embeddable refund estimator",
    description: "Drop-in widget for your platform",
  },
  {
    icon: Puzzle,
    title: "Plugin system",
    description: "Crypto, Rental, and custom extensions",
  },
  {
    icon: TestTube,
    title: "Sandbox environment",
    description: "Test without real IRS submissions",
  },
]

export function DeveloperSection() {
  return (
    <section id="developers" className="py-24 px-4 sm:px-6 lg:px-8 bg-background-alt">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Built for Developers & Fintechs
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors"
            >
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
