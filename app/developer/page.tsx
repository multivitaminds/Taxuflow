import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Code,
  Webhook,
  Key,
  Zap,
  FileJson,
  Terminal,
  Book,
  Building2,
  Users,
  ShoppingCart,
  Plane,
  Heart,
  GraduationCap,
  Briefcase,
  Home,
  TrendingUp,
  Globe,
  Shield,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function DeveloperPage() {
  const industries = [
    {
      icon: Building2,
      name: "Real Estate",
      description: "Property tax calculations, 1031 exchanges, rental income tracking",
      solutions: ["Property depreciation", "Rental income reporting", "Capital gains optimization"],
      link: "/developer/industries/real-estate",
    },
    {
      icon: ShoppingCart,
      name: "E-Commerce",
      description: "Sales tax automation, multi-state compliance, marketplace facilitator rules",
      solutions: ["Sales tax calculation", "Nexus determination", "1099-K reporting"],
      link: "/developer/industries/ecommerce",
    },
    {
      icon: Users,
      name: "HR & Payroll",
      description: "W-2 generation, payroll tax filing, contractor management",
      solutions: ["Automated W-2/1099 filing", "Payroll tax deposits", "Benefits tracking"],
      link: "/developer/industries/hr-payroll",
    },
    {
      icon: Plane,
      name: "Travel & Hospitality",
      description: "Lodging tax, tourism fees, international VAT compliance",
      solutions: ["Occupancy tax filing", "Tourism levy calculation", "Multi-currency support"],
      link: "/developer/industries/travel",
    },
    {
      icon: Heart,
      name: "Healthcare",
      description: "Medical expense deductions, HSA/FSA tracking, provider tax compliance",
      solutions: ["Form 1095 generation", "Medical deduction optimization", "Provider tax filing"],
      link: "/developer/industries/healthcare",
    },
    {
      icon: GraduationCap,
      name: "Education",
      description: "529 plans, education credits, student loan interest deductions",
      solutions: ["Form 1098-T processing", "Education credit calculation", "Scholarship reporting"],
      link: "/developer/industries/education",
    },
    {
      icon: Briefcase,
      name: "Professional Services",
      description: "Self-employment tax, quarterly estimates, business expense tracking",
      solutions: ["Schedule C automation", "Estimated tax calculator", "Mileage tracking"],
      link: "/developer/industries/professional-services",
    },
    {
      icon: Home,
      name: "Property Management",
      description: "Rental property accounting, tenant 1099s, property tax optimization",
      solutions: ["Schedule E automation", "Tenant payment tracking", "Property depreciation"],
      link: "/developer/industries/property-management",
    },
    {
      icon: TrendingUp,
      name: "Financial Services",
      description: "Investment income reporting, capital gains, crypto tax compliance",
      solutions: ["Form 1099-B processing", "Wash sale detection", "Crypto tax calculation"],
      link: "/developer/industries/financial-services",
    },
    {
      icon: Globe,
      name: "International",
      description: "Cross-border tax, FATCA compliance, foreign income reporting",
      solutions: ["FBAR filing", "Foreign tax credit", "Treaty benefits"],
      link: "/developer/industries/international",
    },
  ]

  const products = [
    {
      name: "Tax Filing API",
      description: "Complete tax return preparation and e-filing",
      endpoints: ["Individual 1040", "Business 1120", "Partnership 1065", "S-Corp 1120-S"],
      link: "/developer/products/tax-filing",
    },
    {
      name: "Refund Estimation API",
      description: "Real-time refund calculations and tax projections",
      endpoints: ["Instant estimates", "What-if scenarios", "Tax planning"],
      link: "/developer/products/refund-estimation",
    },
    {
      name: "Document Intelligence API",
      description: "OCR and AI-powered document extraction",
      endpoints: ["W-2 parsing", "1099 extraction", "Receipt categorization"],
      link: "/developer/products/document-intelligence",
    },
    {
      name: "Compliance API",
      description: "Multi-state tax compliance and nexus determination",
      endpoints: ["Sales tax rates", "Nexus tracking", "Filing requirements"],
      link: "/developer/products/compliance",
    },
    {
      name: "Accounting API",
      description: "Full-featured bookkeeping and financial reporting",
      endpoints: ["Chart of accounts", "Journal entries", "Financial statements"],
      link: "/developer/products/accounting",
    },
    {
      name: "Audit Defense API",
      description: "Audit risk assessment and response automation",
      endpoints: ["Risk scoring", "Document organization", "IRS correspondence"],
      link: "/developer/products/audit-defense",
    },
  ]

  const features = [
    {
      icon: Code,
      title: "RESTful API",
      description: "Clean, predictable REST endpoints with comprehensive documentation",
    },
    {
      icon: Webhook,
      title: "Webhooks",
      description: "Real-time notifications for filing status, refund updates, and more",
    },
    {
      icon: Key,
      title: "OAuth 2.0",
      description: "Secure authentication flow for accessing user tax data",
    },
    {
      icon: Zap,
      title: "Rate Limiting",
      description: "Generous rate limits with automatic scaling for enterprise",
    },
    {
      icon: FileJson,
      title: "JSON Responses",
      description: "Consistent, well-structured JSON for all API responses",
    },
    {
      icon: Terminal,
      title: "Sandbox Environment",
      description: "Full-featured test environment with sample data",
    },
    {
      icon: Shield,
      title: "SOC 2 Certified",
      description: "Enterprise-grade security and compliance",
    },
    {
      icon: Clock,
      title: "99.99% Uptime",
      description: "Reliable infrastructure with global redundancy",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-8">
            <Code className="w-4 h-4" />
            Taxu Developer Platform
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Tax Intelligence
            <br />
            <span className="text-glow">For Every Industry</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Comprehensive tax APIs, SDKs, and solutions tailored for your industry. Build compliant, intelligent tax
            features in days, not months.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/developer-portal">
              <Button size="lg" className="glow-neon-strong">
                Get API Key
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/developer/docs">
              <Button size="lg" variant="outline" className="bg-transparent">
                <Book className="mr-2 h-5 w-5" />
                View Documentation
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              99.99% Uptime
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              50ms Response Time
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              SOC 2 Certified
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Industry-Specific Solutions</h2>
            <p className="text-xl text-muted-foreground">Pre-built tax solutions for every business vertical</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => {
              const Icon = industry.icon
              return (
                <Link key={index} href={industry.link}>
                  <div className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 hover:glow-neon transition-all h-full">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{industry.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{industry.description}</p>
                    <ul className="space-y-2">
                      {industry.solutions.map((solution, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products & APIs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Complete Product Suite</h2>
            <p className="text-xl text-muted-foreground">Everything you need to build tax features</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Link key={index} href={product.link}>
                <div className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-all h-full">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{product.description}</p>
                  <div className="space-y-2">
                    {product.endpoints.map((endpoint, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-background-alt border border-border text-sm">
                        {endpoint}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Developer-First Platform</h2>
            <p className="text-xl text-muted-foreground">Built for speed, reliability, and ease of integration</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 hover:glow-neon transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Get Started in Minutes</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to integrate Taxu</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-accent">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Get API Key</h3>
              <p className="text-muted-foreground text-sm">Sign up and get your API key instantly</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-accent">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Install SDK</h3>
              <p className="text-muted-foreground text-sm">Choose from Node.js, Python, Ruby, Go, or PHP</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-accent">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Make First Call</h3>
              <p className="text-muted-foreground text-sm">Start building tax features immediately</p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-8">
            <h3 className="text-xl font-bold mb-4">Example: Calculate Refund Estimate</h3>
            <div className="rounded-xl bg-background-alt border border-border p-6 overflow-x-auto">
              <pre className="text-sm font-mono text-accent">
                <code>{`import Taxu from '@taxu/node';

const taxu = new Taxu('sk_live_abc123xyz');

const estimate = await taxu.refunds.estimate({
  income: 75000,
  filingStatus: 'single',
  deductions: ['standard']
});

console.log(estimate.refundAmount); // $2,450`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-accent/30 bg-card p-12 text-center glow-neon">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-xl text-muted-foreground mb-8">Join thousands of developers building with Taxu</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/developer-portal">
                <Button size="lg" className="glow-neon-strong">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
