import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Zap,
  Users,
  TrendingUp,
  Coffee,
  Laptop,
  Home,
  Plane,
} from "lucide-react"

export default function CareersPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Salary",
      description: "Market-leading compensation with equity options",
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision coverage",
    },
    {
      icon: Home,
      title: "Remote-First",
      description: "Work from anywhere with flexible hours",
    },
    {
      icon: Plane,
      title: "Unlimited PTO",
      description: "Take the time you need to recharge",
    },
    {
      icon: Laptop,
      title: "Equipment Budget",
      description: "$3,000 for your home office setup",
    },
    {
      icon: TrendingUp,
      title: "Learning Budget",
      description: "$2,000/year for courses and conferences",
    },
    {
      icon: Coffee,
      title: "Team Retreats",
      description: "Quarterly in-person team gatherings",
    },
    {
      icon: Users,
      title: "Parental Leave",
      description: "16 weeks paid leave for all parents",
    },
  ]

  const openings = [
    {
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
      description: "Build the next generation of AI-powered tax filing tools using React, Next.js, and Python.",
    },
    {
      title: "Machine Learning Engineer",
      department: "AI/ML",
      location: "Remote (US)",
      type: "Full-time",
      description: "Develop and train AI models for tax document processing and intelligent recommendations.",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote (US)",
      type: "Full-time",
      description: "Create beautiful, intuitive experiences that make tax filing delightful for millions of users.",
    },
    {
      title: "Tax Expert / CPA",
      department: "Tax Operations",
      location: "Remote (US)",
      type: "Full-time",
      description: "Provide expert tax guidance and help train our AI systems with real-world tax knowledge.",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote (US)",
      type: "Full-time",
      description: "Help users navigate their tax filing journey and ensure they have an exceptional experience.",
    },
    {
      title: "Security Engineer",
      department: "Security",
      location: "Remote (US)",
      type: "Full-time",
      description: "Protect user data and maintain our industry-leading security standards and compliance.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Briefcase className="h-4 w-4" />
            Careers at Taxu
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Build the Future of
            <span className="text-accent"> Tax Filing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Join our mission to make tax filing simple, accessible, and stress-free for everyone through AI innovation.
          </p>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Join Taxu?</h2>
            <p className="text-lg text-muted-foreground">
              We're building something special, and we want you to be part of it
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 text-center">
              <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Impact</h3>
              <p className="text-muted-foreground">
                Your work will directly help millions of people navigate one of life's most stressful tasks
              </p>
            </Card>
            <Card className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Growth</h3>
              <p className="text-muted-foreground">
                Join a fast-growing startup where you'll learn, grow, and take on new challenges
              </p>
            </Card>
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Culture</h3>
              <p className="text-muted-foreground">
                Work with talented, passionate people who care about making a difference
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-lg text-muted-foreground">We invest in our team's success and well-being</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="p-6">
                <benefit.icon className="h-8 w-8 text-accent mb-3" />
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground">Find your next opportunity with us</p>
          </div>
          <div className="space-y-4">
            {openings.map((job) => (
              <Card key={job.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{job.department}</Badge>
                          <Badge variant="outline" className="gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{job.description}</p>
                  </div>
                  <Link href="/contact">
                    <Button className="whitespace-nowrap">Apply Now</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Don't See the Right Role?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're always looking for talented people. Send us your resume and let us know what you're passionate about.
          </p>
          <Link href="/contact">
            <Button size="lg" className="glow-neon-strong">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
