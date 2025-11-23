import { Lock, Shield, CheckCircle, FileText, ScrollText } from "lucide-react"

const features = [
  {
    icon: Lock,
    title: "AES-256 encryption",
    description: "Bank-level security for all your data",
  },
  {
    icon: Shield,
    title: "SOC 2 Compliance In Progress",
    description: "Independently audited security controls",
  },
  {
    icon: CheckCircle,
    title: "Identity verification",
    description: "Powered by Stripe Identity",
  },
  {
    icon: FileText,
    title: "IRS E‑File integration",
    description: "Direct submission to the IRS",
  },
  {
    icon: ScrollText,
    title: "AI action logs & audit trails",
    description: "Complete transparency on every decision",
  },
]

export function SecuritySection() {
  return (
    <section id="security" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Built for Trust & Scale</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
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
