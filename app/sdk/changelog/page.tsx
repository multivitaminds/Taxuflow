import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckCircle2, AlertCircle, Zap, Bug, Plus } from "lucide-react"
import Link from "next/link"

export default function ChangelogPage() {
  const releases = [
    {
      version: "1.0.0",
      date: "2025-01-25",
      type: "major",
      changes: [
        { type: "feature", text: "Initial production release of JavaScript SDK" },
        { type: "feature", text: "Support for tax filing (1099-NEC, W-2, Form 941)" },
        { type: "feature", text: "Document upload and AI extraction" },
        { type: "feature", text: "QuickBooks integration and transaction sync" },
        { type: "feature", text: "Refund estimation API" },
        { type: "feature", text: "Webhook event handling" },
        { type: "feature", text: "Full TypeScript support with type definitions" },
        { type: "feature", text: "Comprehensive test suite (23 tests, 60.6% coverage)" },
        { type: "feature", text: "Automated CI/CD with GitHub Actions" },
      ],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">SDK Changelog</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Track updates, new features, and improvements to the Taxu SDKs.
            </p>
          </div>

          <div className="space-y-12">
            {releases.map((release) => (
              <div key={release.version} className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">{release.version}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        release.type === "major"
                          ? "bg-accent/10 text-accent"
                          : release.type === "minor"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {release.type}
                    </span>
                  </div>
                  <span className="text-muted-foreground">{release.date}</span>
                </div>

                <div className="rounded-2xl border border-border bg-card p-8">
                  <ul className="space-y-4">
                    {release.changes.map((change, index) => {
                      const Icon =
                        change.type === "feature"
                          ? Plus
                          : change.type === "improvement"
                            ? Zap
                            : change.type === "fix"
                              ? Bug
                              : AlertCircle

                      const colorClass =
                        change.type === "feature"
                          ? "text-green-500"
                          : change.type === "improvement"
                            ? "text-blue-500"
                            : change.type === "fix"
                              ? "text-orange-500"
                              : "text-red-500"

                      return (
                        <li key={index} className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 ${colorClass} mt-0.5 flex-shrink-0`} />
                          <span className="leading-relaxed">{change.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-accent/30 bg-card p-8 text-center glow-neon">
            <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">Get notified about new SDK releases and features</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="https://github.com/multivitaminds/taxu-js" target="_blank" rel="noopener noreferrer">
                <button className="px-6 py-3 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent font-semibold transition-colors">
                  Watch on GitHub
                </button>
              </Link>
              <Link href="/developer-portal">
                <button className="px-6 py-3 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-semibold transition-colors">
                  Join Developer Portal
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
