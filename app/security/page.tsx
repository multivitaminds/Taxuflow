import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Lock, Eye, FileCheck, Server, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "AES-256 Encryption",
      description: "All data encrypted at rest and in transit using military-grade encryption standards.",
    },
    {
      icon: Shield,
      title: "SOC 2 Compliance In Progress",
      description: "Working towards independent audit certification for security, availability, and confidentiality.",
    },
    {
      icon: FileCheck,
      title: "IRS e-file Compliant",
      description: "Fully certified by the IRS for electronic filing with all required security measures.",
    },
    {
      icon: Eye,
      title: "Zero-Knowledge Storage",
      description: "Your documents are encrypted with keys only you control. We can't access your data.",
    },
    {
      icon: Server,
      title: "TLS 1.3",
      description: "Latest transport layer security protocol for all data transmission.",
    },
    {
      icon: CheckCircle,
      title: "Multi-Factor Authentication",
      description: "Optional 2FA via SMS, authenticator apps, or biometric verification.",
    },
  ]

  const compliance = [
    {
      title: "IRS Publication 1075",
      description: "Compliant with federal tax information safeguarding requirements",
    },
    {
      title: "GLBA",
      description: "Gramm-Leach-Bliley Act financial privacy standards",
    },
    {
      title: "CCPA & GDPR",
      description: "California and European data privacy regulations",
    },
    {
      title: "PCI DSS",
      description: "Payment Card Industry Data Security Standard for payment processing",
    },
  ]

  const dataProtection = [
    {
      title: "Encrypted at Rest",
      description: "All stored data encrypted using AES-256",
      icon: Lock,
    },
    {
      title: "Encrypted in Transit",
      description: "TLS 1.3 for all data transmission",
      icon: Shield,
    },
    {
      title: "Regular Backups",
      description: "Automated daily backups with 30-day retention",
      icon: Server,
    },
    {
      title: "Access Controls",
      description: "Role-based permissions and audit logging",
      icon: Eye,
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero text-white pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#00D4FF] text-sm font-medium border border-white/20 mb-8 backdrop-blur-sm">
            <Shield className="w-4 h-4" />
            <span>Security & Compliance</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
            Your Data is
            <br />
            <span className="text-[#00D4FF]">Fort Knox Secure</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 text-balance mb-10 max-w-3xl mx-auto leading-relaxed">
            Bank-level encryption, IRS compliance, and zero-knowledge architecture. Your tax data is protected by the
            same security used by financial institutions.
          </p>
          <Link href="/security/docs">
            <Button
              size="lg"
              className="bg-white text-[#0a2540] hover:bg-white/90 font-semibold rounded-full px-8 h-12 shadow-lg"
            >
              View Security Docs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Enterprise-Grade Security</h2>
            <p className="text-xl text-slate-600">Multiple layers of protection for your sensitive data</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="rounded-xl border-slate-200 bg-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                    <Icon className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Compliance & Certifications</h2>
            <p className="text-xl text-slate-600">Meeting the highest industry standards</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {compliance.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-[#635BFF]/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How We Protect Your Data</h2>
            <p className="text-xl text-slate-600">Multi-layered security architecture</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {dataProtection.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="flex gap-6 p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#635BFF] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#635BFF]/20">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Identity Verification */}
      <section className="py-24 px-6 bg-[#0a2540] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#635BFF]/20 to-transparent" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] text-sm font-bold mb-6 border border-[#00D4FF]/20">
                IDENTITY VERIFICATION
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">Fraud Prevention & Identity Safety</h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Powered by Stripe Identity, we verify your identity to prevent fraud and protect your tax return from
                unauthorized access.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#00D4FF] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-[#0a2540]" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Government ID Verification</div>
                    <div className="text-slate-400">Secure document scanning and validation</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#00D4FF] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-[#0a2540]" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Biometric Matching</div>
                    <div className="text-slate-400">Facial recognition to confirm identity</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#00D4FF] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-[#0a2540]" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Fraud Detection</div>
                    <div className="text-slate-400">AI-powered anomaly detection</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#635BFF] blur-[100px] opacity-20 rounded-full" />
              <Card className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-3xl overflow-hidden">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#635BFF] to-[#00D4FF] flex items-center justify-center shadow-2xl">
                  <Shield className="w-40 h-40 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0a2540] to-transparent opacity-80" />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Data Transparency</h2>
            <p className="text-xl text-slate-600 mb-8">You own your data. Period.</p>
          </div>

          <div className="space-y-4">
            <div className="p-8 rounded-2xl border border-slate-200 bg-white flex items-start gap-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">What We Collect</h3>
                <p className="text-slate-600 leading-relaxed">
                  Only the information necessary to file your taxes: income documents, deductions, and personal details
                  required by the IRS.
                </p>
              </div>
            </div>
            <div className="p-8 rounded-2xl border border-slate-200 bg-white flex items-start gap-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">How We Use It</h3>
                <p className="text-slate-600 leading-relaxed">
                  Exclusively for tax preparation and filing. We never sell your data or use it for advertising.
                </p>
              </div>
            </div>
            <div className="p-8 rounded-2xl border border-slate-200 bg-white flex items-start gap-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Your Rights</h3>
                <p className="text-slate-600 leading-relaxed">
                  Download, delete, or export your data anytime. Full control over your information.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="bg-transparent border-slate-300 text-slate-700 hover:bg-white hover:text-[#635BFF] hover:border-[#635BFF]"
            >
              Read Full Privacy Policy
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Questions About Security?</h2>
          <p className="text-xl text-slate-600 mb-10">Our security team is here to help</p>
          <Button size="lg" className="bg-[#0a2540] text-white hover:bg-[#0a2540]/90 rounded-full px-10 h-12 shadow-xl">
            Contact Security Team
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
