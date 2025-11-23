import { Code2, Webhook, Puzzle, Box, TestTube, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <section id="developers" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a2540] text-white clip-diagonal-reverse">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance mb-6">
              Built for Developers & Fintechs
            </h2>
            <p className="text-xl text-slate-300 max-w-xl">
              Integrate tax filing and accounting into your platform with our robust API and SDKs.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold rounded-full px-8"
            >
              <Link href="/developer">
                Read the Docs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl bg-[#113154] p-6 hover:bg-[#1a3b61] transition-colors border border-white/5"
            >
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff]">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}

          {/* Code Preview Card */}
          <div className="rounded-xl bg-[#113154] p-6 border border-white/5 sm:col-span-2 lg:col-span-1 font-mono text-xs overflow-hidden relative group">
            <div className="absolute top-0 left-0 right-0 h-8 bg-[#0a2540] flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            </div>
            <div className="mt-6 text-slate-300">
              <p>
                <span className="text-[#00d4ff]">const</span> taxu = <span className="text-[#00d4ff]">require</span>
                ('taxu')('sk_test_...');
              </p>
              <br />
              <p>
                <span className="text-[#00d4ff]">const</span> filing = <span className="text-[#00d4ff]">await</span>{" "}
                taxu.filings.create({"{"}
              </p>
              <p className="pl-4">user_id: 'usr_123',</p>
              <p className="pl-4">year: 2024,</p>
              <p className="pl-4">form: '1040'</p>
              <p>{"}"});</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#113154] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
              <span className="text-[#00d4ff] font-sans font-semibold text-sm">View API Reference →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
