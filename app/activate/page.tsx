"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Code2, CreditCard, TrendingUp, Calculator, ArrowRight, Check } from "lucide-react"

const platforms = [
  {
    id: "developer",
    name: "Developer API",
    description: "Integrate Taxu services into your applications",
    icon: Code2,
    features: ["API Access", "Webhooks", "SDKs", "Sandbox Environment"],
    color: "from-blue-500 to-cyan-500",
    href: "/activate/developer",
  },
  {
    id: "neobank",
    name: "Neobank",
    description: "Modern banking for businesses and individuals",
    icon: CreditCard,
    features: ["Bank Accounts", "Cards", "Transfers", "Bill Pay"],
    color: "from-emerald-500 to-teal-500",
    href: "/activate/neobank",
  },
  {
    id: "investment",
    name: "Investment Platform",
    description: "Build and manage investment portfolios",
    icon: TrendingUp,
    features: ["Stock Trading", "Crypto", "Portfolios", "Analytics"],
    color: "from-violet-500 to-purple-500",
    href: "/activate/investment",
  },
  {
    id: "accounting",
    name: "Accounting Suite",
    description: "Complete accounting and tax compliance",
    icon: Calculator,
    features: ["Invoicing", "Expenses", "Tax Filing", "Reporting"],
    color: "from-amber-500 to-orange-500",
    href: "/activate/accounting",
  },
]

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Activate Your Live Account
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the Taxu platform you want to activate and start building your financial future
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {platforms.map((platform) => {
            const Icon = platform.icon
            return (
              <Card
                key={platform.id}
                className="group relative overflow-hidden bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <Link href={platform.href}>
                  <div className="p-8">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-slate-900">{platform.name}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{platform.description}</p>

                    <div className="space-y-3 mb-6">
                      {platform.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-slate-600" />
                          </div>
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className={`w-full bg-gradient-to-r ${platform.color} hover:opacity-90 text-white`}>
                      Activate {platform.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Link>
              </Card>
            )
          })}
        </div>

        <Card className="bg-slate-900 text-white p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need Multiple Platforms?</h3>
              <p className="text-slate-300">Activate all Taxu services in one go and unlock the full platform</p>
            </div>
            <Link href="/activate/all">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              >
                Activate All Platforms
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
