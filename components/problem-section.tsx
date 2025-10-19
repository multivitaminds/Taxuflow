import { X, Check } from "lucide-react"

export function ProblemSection() {
  const legacyProblems = [
    "High cost ($200-$300 per return)",
    "Confusing UX and hidden fees",
    "Human delay (days to weeks)",
    "Limited support windows (seasonal only)",
    "No year-round tax planning",
  ]

  const taxuSolutions = [
    "Free for simple returns, $29 for complex",
    "Clean, conversational AI interface",
    "Files in 5 minutes with AI",
    "24/7 AI assistant available",
    "Year-round tax planning & reminders",
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Your taxes shouldn't cost $300 or take 3 hours</h2>
          <p className="text-xl text-muted-foreground">Taxu files in 5 minutes. And it's free.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Legacy Platforms */}
          <div className="rounded-2xl border border-destructive/20 bg-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold">Legacy Platforms</h3>
            </div>
            <ul className="space-y-4">
              {legacyProblems.map((problem, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Taxu Solutions */}
          <div className="rounded-2xl border border-accent/30 bg-card p-8 glow-neon">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Taxu</h3>
            </div>
            <ul className="space-y-4">
              {taxuSolutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
