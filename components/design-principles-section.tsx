import { Check } from "lucide-react"

const principles = [
  "Clean white space & minimal UI",
  "Progressive disclosure (only see what's relevant)",
  "Dark Mode & Accessibility built-in",
  "Mobile-optimized",
  "Confetti moment when refund is confirmed",
]

export function DesignPrinciplesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Inspired by What Makes Cal.com Great
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {principles.map((principle, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                <Check className="h-4 w-4 text-accent" />
              </div>
              <p className="text-base leading-relaxed">{principle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
