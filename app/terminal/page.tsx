import Link from "next/link"
import { ArrowRight, ChevronRight, CreditCard, Smartphone, Wifi } from "lucide-react"

export default function TerminalPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-stripe-hero">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-sm font-medium mb-8">
                <span className="bg-[#6366f1] text-white text-xs px-2 py-0.5 rounded-full">Beta</span>
                Mobile tax prep for accountants
                <ChevronRight className="w-4 h-4" />
              </div>
              <h1 className="text-6xl lg:text-[5.5rem] font-bold tracking-tight text-[#0a2540] leading-[1.1] mb-8">
                Tax prep on the go
              </h1>
              <p className="text-xl text-[#425466] mb-10 leading-relaxed max-w-lg">
                Taxu Terminal brings professional tax preparation to your mobile device. Meet clients anywhere, collect
                documents instantly, and file returns on the spot.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/get-started"
                  className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
                >
                  Request early access
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative lg:h-[600px] w-full hidden lg:block">
              <div className="absolute top-10 right-0 w-[350px]">
                <div className="bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-3xl shadow-2xl p-8 text-white">
                  <Smartphone className="w-16 h-16 mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Mobile-First Platform</h3>
                  <p className="text-white/90 leading-relaxed">
                    Complete tax returns from your phone or tablet with our intuitive mobile interface designed for tax
                    professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#0a2540] mb-16 text-center">Everything you need on mobile</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: CreditCard,
                title: "Document capture",
                desc: "Scan W-2s, 1099s, and receipts with your phone camera. AI automatically extracts all relevant data.",
              },
              {
                icon: Smartphone,
                title: "Client meetings",
                desc: "Review returns with clients in real-time, collect signatures, and file electronically on the spot.",
              },
              {
                icon: Wifi,
                title: "Offline mode",
                desc: "Work anywhere without internet. Data syncs automatically when you're back online.",
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="w-12 h-12 bg-[#f6f9fc] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6366f1] transition-colors">
                  <item.icon className="w-6 h-6 text-[#6366f1] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-[#0a2540] mb-3">{item.title}</h4>
                <p className="text-[#425466] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#0a2540] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Join the beta program</h2>
          <p className="text-xl text-[#adbdcc] mb-10 max-w-2xl mx-auto">
            Taxu Terminal is currently in beta. Request early access to be among the first tax professionals to use our
            mobile platform.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
          >
            Request access
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  )
}
