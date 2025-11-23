import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Send, Check } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function FilingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero text-white pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
            <Send className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm font-medium text-[#00D4FF]">E-Filing</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
            AI-Powered <span className="text-[#00D4FF]">E-Filing</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 text-balance mb-10 max-w-3xl mx-auto leading-relaxed">
            Our AI prepares, reviews, and files your return with the IRS automatically with 100% accuracy guarantee.
          </p>
          <Link href="/get-started">
            <Button
              size="lg"
              className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0a2540] font-semibold rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Start Filing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-[#635BFF]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 text-[#635BFF]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Happens When You File</h2>
            <p className="text-xl text-slate-600">Seamless, secure, and instant submission</p>
          </div>

          <div className="space-y-4">
            {[
              "AI reviews your return for errors and missing information",
              "Automatic compliance checking against current tax laws",
              "Direct e-file to IRS and state agencies",
              "Real-time filing status updates",
              "Confirmation receipts and tracking",
            ].map((step, index) => (
              <Card
                key={index}
                className="flex items-center gap-4 p-6 rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-all bg-white"
              >
                <div className="w-8 h-8 rounded-full bg-[#00D4FF]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#00D4FF]" />
                </div>
                <span className="text-lg text-slate-700 font-medium">{step}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
