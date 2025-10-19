import { User, Upload, Receipt, FileCheck, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: User,
    title: "Identity & Status",
    description: "Tell us about yourself",
  },
  {
    icon: Upload,
    title: "Income Upload",
    description: "W‑2, 1099, and more",
  },
  {
    icon: Receipt,
    title: "Deductions & Credits",
    description: "Maximize your refund",
  },
  {
    icon: FileCheck,
    title: "Review Summary",
    description: "Double-check everything",
  },
  {
    icon: TrendingUp,
    title: "File & Track Refund",
    description: "Submit and celebrate",
  },
]

export function FilingFlowSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background-alt">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Your Taxes in 5 Simple Steps</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-accent" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-balance">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-balance">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
