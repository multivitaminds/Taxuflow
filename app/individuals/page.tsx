import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Users, Briefcase, GraduationCap, Car } from "lucide-react"
import Link from "next/link"

export default function IndividualsPage() {
  const userTypes = [
    {
      icon: Users,
      title: "W-2 Employees",
      description: "Simple filing for salaried workers",
      features: [
        "Upload W-2 and file in minutes",
        "Standard deduction optimization",
        "Multi-state support",
        "Dependent management",
      ],
    },
    {
      icon: GraduationCap,
      title: "Students",
      description: "Education credits and deductions",
      features: [
        "1098-T form support",
        "Student loan interest deduction",
        "Education credit maximization",
        "Part-time job income handling",
      ],
    },
    {
      icon: Car,
      title: "Gig Workers",
      description: "For Uber, DoorDash, freelancers",
      features: [
        "1099 income tracking",
        "Mileage deduction calculator",
        "Quarterly tax estimates",
        "Self-employment tax optimization",
      ],
    },
    {
      icon: Briefcase,
      title: "Side Hustlers",
      description: "W-2 plus freelance income",
      features: [
        "Combined W-2 and 1099 filing",
        "Home office deduction",
        "Equipment depreciation",
        "Estimated tax payment planning",
      ],
    },
  ]

  const benefits = [
    "Free for simple returns (W-2 only)",
    "Premium filing for $29 (includes state)",
    "Unlimited amendments at no extra cost",
    "7-year document storage",
    "Maximum refund guarantee",
    "Audit support included",
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Built for <span className="text-glow">Your Life</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Whether you're a W-2 employee, student, gig worker, or side hustler — Taxu handles it all.
          </p>
          <Link href="/get-started">
            <Button size="lg" className="glow-neon-strong">
              Start Filing Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* User Types Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Designed for Every Situation</h2>
            <p className="text-xl text-muted-foreground">Taxu adapts to your unique tax situation</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {userTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-8 hover:border-accent/50 hover:glow-neon transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{type.title}</h3>
                  <p className="text-muted-foreground mb-6">{type.description}</p>
                  <ul className="space-y-3">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">One platform, all your tax needs covered</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload and Go Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">Upload and Go</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                No complicated forms. No confusing questions. Just upload your documents and let Taxu's AI handle the
                rest.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Instant Document Scanning</div>
                    <div className="text-muted-foreground">AI reads your W-2, 1099s, and other forms in seconds</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Smart Deduction Finder</div>
                    <div className="text-muted-foreground">
                      AI suggests deductions based on your situation and industry
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Real-Time Refund Tracking</div>
                    <div className="text-muted-foreground">
                      Watch your refund estimate update as you add information
                    </div>
                  </div>
                </li>
              </ul>
              <Link href="/get-started">
                <Button size="lg" className="glow-neon">
                  Try It Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 glow-neon">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=500&width=500"
                  alt="Upload interface"
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to File Smarter?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of individuals who've already filed with Taxu
          </p>
          <Link href="/get-started">
            <Button size="lg" className="glow-neon-strong">
              Start Your Free Return
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
