import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Target, Users, Lightbulb, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're on a mission to make tax filing accessible, affordable, and stress-free for everyone.",
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description:
        "We leverage cutting-edge AI technology to continuously improve and simplify the tax filing experience.",
    },
    {
      icon: Heart,
      title: "Customer-Centric",
      description: "Every decision we make is guided by what's best for our users and their financial well-being.",
    },
    {
      icon: Globe,
      title: "Transparency",
      description: "We believe in clear pricing, honest communication, and building trust through openness.",
    },
  ]

  const milestones = [
    { year: "2023", event: "Taxu founded with vision to democratize tax filing" },
    { year: "2024", event: "Launched AI-powered tax assistant Sophie" },
    { year: "2024", event: "Processed 100,000+ tax returns" },
    { year: "2024", event: "Achieved SOC 2 Type II certification" },
    { year: "2025", event: "Expanded to business tax filing solutions" },
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former tax attorney with 15 years of experience. Stanford Law graduate.",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      bio: "AI researcher from MIT. Previously led ML teams at major tech companies.",
    },
    {
      name: "Emily Watson",
      role: "Head of Product",
      bio: "Product leader with background in fintech. Passionate about user experience.",
    },
    {
      name: "David Kim",
      role: "Head of Security",
      bio: "Cybersecurity expert with certifications in CISSP and CISM.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            About Taxu
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Making Tax Filing
            <span className="text-accent"> Simple for Everyone</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            We're building the future of tax filing with AI-powered technology that puts you in control of your
            finances.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Tax filing shouldn't be complicated, expensive, or stressful. We're on a mission to democratize access
                to professional-grade tax services through artificial intelligence.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                By combining advanced AI with deep tax expertise, we're making it possible for everyone to file their
                taxes with confidence, maximize their refunds, and stay compliant—all at a fraction of the traditional
                cost.
              </p>
              <Link href="/get-started">
                <Button size="lg" className="glow-neon-strong">
                  Get Started Today
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-accent mb-2">1M+</div>
                <div className="text-sm text-muted-foreground">Returns Filed</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-accent mb-2">$2.5B</div>
                <div className="text-sm text-muted-foreground">Refunds Processed</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-accent mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-accent mb-2">4.9/5</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="p-6">
                <value.icon className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">Key milestones in our mission to transform tax filing</p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-20 text-right">
                  <div className="text-2xl font-bold text-accent">{milestone.year}</div>
                </div>
                <div className="flex-shrink-0 mt-2">
                  <div className="w-4 h-4 rounded-full bg-accent" />
                </div>
                <Card className="flex-1 p-6">
                  <p className="text-lg">{milestone.event}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground">Meet the people building the future of tax filing</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <div className="text-sm text-accent mb-3">{member.role}</div>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent/10 via-background to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Join Us on Our Mission</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you're looking to file your taxes or join our team, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" className="glow-neon-strong">
                Start Filing Today
              </Button>
            </Link>
            <Link href="/careers">
              <Button size="lg" variant="outline">
                View Open Positions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
