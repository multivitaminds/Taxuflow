import Link from "next/link"
import { ArrowRight, ChevronRight, Check } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"

export interface MarketingPageProps {
  title: string
  subtitle: string
  description: string
  heroImage?: string
  features: {
    title: string
    description: string
    icon?: any
  }[]
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
}

export function MarketingPageTemplate({ title, subtitle, description, heroImage, features, cta }: MarketingPageProps) {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-stripe-hero">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-8 border border-white/20 backdrop-blur-sm">
                <span className="bg-[#00d4ff] text-[#0a2540] text-xs px-2 py-0.5 rounded-full font-semibold">New</span>
                {subtitle}
              </div>
              <h1 className="text-5xl lg:text-[4.5rem] font-bold tracking-tight text-white leading-[1.1] mb-8">
                {title}
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-lg">{description}</p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className="px-8 py-6 bg-white text-[#0a2540] rounded-full font-medium hover:bg-white/90 transition-colors shadow-lg text-base"
                >
                  <Link href="/login">
                    Start now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="px-8 py-6 text-white font-medium hover:text-[#00d4ff] hover:bg-white/10 transition-colors border-white/20 rounded-full backdrop-blur-sm text-base bg-transparent"
                >
                  <Link href="/contact">
                    Contact sales
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative lg:h-[600px] w-full hidden lg:flex items-center justify-center">
              {/* Placeholder for specific hero visuals */}
              <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl transform rotate-[-5deg]">
                <div className="flex justify-between items-center mb-8">
                  <div className="h-8 w-32 bg-white/20 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-[#00d4ff] rounded-full" />
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10">
                      <div className="w-10 h-10 bg-white/10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-white/20 rounded" />
                        <div className="h-2 w-16 bg-white/10 rounded" />
                      </div>
                      <div className="h-4 w-12 bg-[#00d4ff]/80 rounded" />
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Total Volume</span>
                    <span className="font-mono text-[#00d4ff]">$1,234,567.89</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#f6f9fc]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#635bff]/10 rounded-xl flex items-center justify-center mb-6 text-[#635bff]">
                  {feature.icon ? <feature.icon className="w-6 h-6" /> : <Check className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold text-[#0a2540] mb-3">{feature.title}</h3>
                <p className="text-[#425466] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#0a2540] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{cta.title}</h2>
          <p className="text-xl text-[#adbdcc] max-w-2xl mx-auto mb-10">{cta.description}</p>
          <div className="flex justify-center gap-4">
            <Button
              asChild
              className="px-8 py-6 bg-[#00d4ff] text-[#0a2540] rounded-full font-medium hover:bg-[#00c4eb] transition-colors text-base"
            >
              <Link href={cta.buttonLink}>
                {cta.buttonText}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer (Simplified or imported from layout) */}
      {/* The main layout handles footer, so we don't add it here explicitly unless needed */}
    </main>
  )
}
