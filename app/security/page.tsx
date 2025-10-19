import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Lock, Eye, FileCheck, Server, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "AES-256 Encryption",
      description: "All data encrypted at rest and in transit using military-grade encryption standards.",
    },
    {
      icon: Shield,
      title: "SOC 2 Type II Certified",
      description: "Independently audited and certified for security, availability, and confidentiality.",
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
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-8">
            <Shield className="w-4 h-4" />
            Security & Compliance
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Your Data is
            <br />
            <span className="text-glow">Fort Knox Secure</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Bank-level encryption, IRS compliance, and zero-knowledge architecture. Your tax data is protected by the
            same security used by financial institutions.
          </p>
          <Link href="/security/docs">
            <Button size="lg" className="glow-neon-strong">
              View Security Docs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-xl text-muted-foreground">Multiple layers of protection for your sensitive data</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 hover:glow-neon transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Compliance & Certifications</h2>
            <p className="text-xl text-muted-foreground">Meeting the highest industry standards</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {compliance.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors"
              >
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">How We Protect Your Data</h2>
            <p className="text-xl text-muted-foreground">Multi-layered security architecture</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {dataProtection.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex gap-6 p-8 rounded-2xl border border-border bg-card">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Identity Verification */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">Identity Verification</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Powered by Stripe Identity, we verify your identity to prevent fraud and protect your tax return from
                unauthorized access.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Government ID Verification</div>
                    <div className="text-muted-foreground">Secure document scanning and validation</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Biometric Matching</div>
                    <div className="text-muted-foreground">Facial recognition to confirm identity</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Fraud Detection</div>
                    <div className="text-muted-foreground">AI-powered anomaly detection</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 glow-neon">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <Shield className="w-32 h-32 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Data Transparency</h2>
            <p className="text-xl text-muted-foreground mb-8">You own your data. Period.</p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-4">
                <Eye className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold mb-2">What We Collect</h3>
                  <p className="text-muted-foreground">
                    Only the information necessary to file your taxes: income documents, deductions, and personal
                    details required by the IRS.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold mb-2">How We Use It</h3>
                  <p className="text-muted-foreground">
                    Exclusively for tax preparation and filing. We never sell your data or use it for advertising.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Your Rights</h3>
                  <p className="text-muted-foreground">
                    Download, delete, or export your data anytime. Full control over your information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="bg-transparent">
              Read Full Privacy Policy
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Questions About Security?</h2>
          <p className="text-xl text-muted-foreground mb-8">Our security team is here to help</p>
          <Button size="lg" className="glow-neon-strong">
            Contact Security Team
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
