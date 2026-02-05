import Link from "next/link"
import { ArrowRight, Check, ChevronRight, Globe, Shield, Zap, CreditCard, Smartphone, Layout } from "lucide-react"

export default function PaymentsPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-stripe-hero">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635bff]/10 text-[#635bff] text-sm font-medium mb-8">
                <span className="bg-[#635bff] text-white text-xs px-2 py-0.5 rounded-full">New</span>
                Global Payment Methods - Accept 135+ currencies
                <ChevronRight className="w-4 h-4" />
              </div>
              <h1 className="text-6xl lg:text-[5.5rem] font-bold tracking-tight text-[#0a2540] leading-[1.1] mb-8">
                The complete payments platform
              </h1>
              <p className="text-xl text-[#425466] mb-10 leading-relaxed max-w-lg">
                Taxu brings together everything that's required to build websites and apps that accept payments and send
                payouts globally. Taxu's products power payments for online and in-person retailers, subscriptions
                businesses, software platforms and marketplaces, and everything in between.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 bg-[#635bff] text-white rounded-full font-medium hover:bg-[#5851df] transition-colors group"
                >
                  Start now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 text-[#0a2540] font-medium hover:text-[#635bff] transition-colors"
                >
                  Contact sales
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative lg:h-[600px] w-full hidden lg:block">
              {/* Payment UI Mockup */}
              <div className="absolute top-10 right-0 w-[450px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="font-bold text-[#0a2540]">Checkout</div>
                  <div className="text-sm text-gray-500">Test Mode</div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Email</div>
                    <div className="h-10 bg-gray-50 rounded-md border border-gray-200 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Card Information</div>
                    <div className="h-10 bg-gray-50 rounded-md border border-gray-200 w-full flex items-center px-3 gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <div className="flex-1" />
                      <div className="w-8 h-5 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Expiry</div>
                      <div className="h-10 bg-gray-50 rounded-md border border-gray-200 w-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">CVC</div>
                      <div className="h-10 bg-gray-50 rounded-md border border-gray-200 w-full" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="h-12 bg-[#635bff] rounded-md w-full flex items-center justify-center text-white font-medium">
                      Pay $24.00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-[#635bff] font-semibold mb-6">Unified platform</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-[#0a2540] mb-6 leading-tight">
              A fully integrated suite of payments products
            </h3>
            <p className="text-xl text-[#425466]">
              We bring together everything that's required to build websites and apps that accept payments and send
              payouts globally. Taxu's products power payments for online and in-person retailers, subscriptions
              businesses, software platforms and marketplaces, and everything in between.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Globe,
                title: "Global reach",
                desc: "Accept payments from anywhere in the world. We support 135+ currencies and dozens of payment methods.",
              },
              {
                icon: Shield,
                title: "Fraud protection",
                desc: "Detect and block fraud with Radar, a machine learning fraud system trained on data from millions of global businesses.",
              },
              {
                icon: Zap,
                title: "Optimized checkout",
                desc: "Increase conversion with a checkout flow that adapts to your customer's device and location.",
              },
              {
                icon: CreditCard,
                title: "Card issuing",
                desc: "Create, distribute, and manage physical and virtual cards for your employees or customers.",
              },
              {
                icon: Smartphone,
                title: "In-person payments",
                desc: "Accept payments in your store with Terminal, our programmable point of sale.",
              },
              {
                icon: Layout,
                title: "Platform payments",
                desc: "Use Connect to onboard users, accept payments, and pay out to third parties.",
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="w-12 h-12 bg-[#f6f9fc] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#635bff] transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-[#635bff] group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-bold text-[#0a2540] mb-3">{item.title}</h4>
                <p className="text-[#425466] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Experience */}
      <section className="py-32 bg-[#f6f9fc]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[#635bff] font-semibold mb-6">Developer-first</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-[#0a2540] mb-6 leading-tight">
                The world's most powerful and easy-to-use APIs
              </h3>
              <p className="text-xl text-[#425466] mb-8">
                We agonize over the right abstractions so your teams don't need to stitch together disparate systems or
                spend months integrating payments functionality.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Client and server libraries for React, Python, Ruby, PHP, and more",
                  "Robust testing environment with test cards and webhooks",
                  "Comprehensive documentation and guides",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#635bff] flex-shrink-0 mt-1" />
                    <span className="text-[#425466]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/developer"
                className="inline-flex items-center text-[#635bff] font-semibold hover:text-[#0a2540] transition-colors"
              >
                Read the documentation <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="bg-[#1a2540] rounded-xl shadow-2xl overflow-hidden border border-[#2e3d50]">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a2540] border-b border-[#2e3d50]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="text-xs text-[#adbdcc] font-mono">payment.js</div>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <div className="text-[#adbdcc]">
                  <span className="text-[#ff7b72]">const</span> taxu <span className="text-[#ff7b72]">=</span> require(
                  <span className="text-[#a5d6ff]">'taxu'</span>)(
                  <span className="text-[#a5d6ff]">'sk_test_...'</span>);
                  <br />
                  <br />
                  <span className="text-[#8b949e]">// Create a PaymentIntent with the order amount and currency</span>
                  <br />
                  <span className="text-[#ff7b72]">const</span> paymentIntent <span className="text-[#ff7b72]">=</span>{" "}
                  <span className="text-[#ff7b72]">await</span> taxu.paymentIntents.create({"{ "}
                  <br />
                  &nbsp;&nbsp;amount: <span className="text-[#79c0ff]">1099</span>,<br />
                  &nbsp;&nbsp;currency: <span className="text-[#a5d6ff]">'usd'</span>,<br />
                  &nbsp;&nbsp;automatic_payment_methods: {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;enabled: <span className="text-[#79c0ff]">true</span>,<br />
                  &nbsp;&nbsp;{"}"},<br />
                  {"}"});
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#0a2540] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#635bff]/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to get started?</h2>
          <p className="text-xl text-[#adbdcc] mb-10 max-w-2xl mx-auto">
            Explore Taxu Payments, or create an account instantly and start accepting payments. You can also contact us
            to design a custom package for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-[#635bff] text-white rounded-full font-medium hover:bg-[#5851df] transition-colors group"
            >
              Start now
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors"
            >
              Contact sales
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f6f9fc] py-20 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Products</div>
              <ul className="space-y-3">
                {["Payments", "Billing", "Connect", "Payouts", "Issuing", "Terminal", "Tax", "Identity"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Solutions</div>
              <ul className="space-y-3">
                {[
                  "Ecommerce",
                  "SaaS",
                  "Marketplaces",
                  "Embedded Finance",
                  "Platforms",
                  "Creator Economy",
                  "Crypto",
                  "Global Businesses",
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Resources</div>
              <ul className="space-y-3">
                {[
                  "Support",
                  "Contact Sales",
                  "Blog",
                  "Guides",
                  "Customer Stories",
                  "Developers",
                  "API Reference",
                  "Partners",
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Company</div>
              <ul className="space-y-3">
                {["Jobs", "Newsroom", "Taxu Press", "Become a Partner", "Privacy & Terms", "Sitemap"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
            <div className="text-[#425466] font-medium">© 2025 Taxu, Inc.</div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-[#0a2540] font-bold">
                <div className="w-2 h-2 bg-[#0a2540] rounded-full" />
                Taxu
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
