const roadmap = [
  {
    quarter: "Q1 2025",
    title: "MVP Launch",
    description: "Simple W-2 filing with AI assistance",
    status: "current",
  },
  {
    quarter: "Q2 2025",
    title: "Enhanced Filing",
    description: "1099, Joint Filing, State Returns",
    status: "upcoming",
  },
  {
    quarter: "Q3 2025",
    title: "Advanced Features",
    description: "Audit Defense, Crypto Plugin, Tax Calendar",
    status: "upcoming",
  },
]

export function RoadmapSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Product Roadmap</h2>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-8">
            {roadmap.map((item, index) => (
              <div key={index} className="relative flex gap-6">
                <div
                  className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold ${
                    item.status === "current" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 pb-8">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-accent">{item.quarter}</span>
                      {item.status === "current" && (
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                          In Progress
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
