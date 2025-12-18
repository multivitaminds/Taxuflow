import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Target, Users, Lightbulb, Globe, Heart, ArrowRight } from "lucide-react"

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
    { year: "2024", event: "Began SOC 2 compliance process" },
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden gradient-stripe-hero clip-diagonal">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-8 backdrop-blur-sm border border-white/20">
              <Users className="h-4 w-4" />
              About Taxu
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight leading-tight">
              Making tax filing
              <br />
              <span className="text-blue-200">simple for everyone</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              We're building the future of tax filing with AI-powered technology that puts you in control of your
              finances.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-[#0a2540]">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Tax filing shouldn't be complicated, expensive, or stressful. We're on a mission to democratize access
                to professional-grade tax services through artificial intelligence.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                By combining advanced AI with deep tax expertise, we're making it possible for everyone to file their
                taxes with confidence, maximize their refunds, and stay compliant—all at a fraction of the traditional
                cost.
              </p>
              <Link href="/get-started">
                <Button className="rounded-full bg-[#635bff] hover:bg-[#0a2540] text-white px-8 py-6 text-lg transition-all duration-300 group">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-8 text-center border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
                <div className="text-4xl font-bold text-[#635bff] mb-2">1M+</div>
                <div className="text-sm text-slate-500 font-medium">Returns Filed</div>
              </Card>
              <Card className="p-8 text-center border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
                <div className="text-4xl font-bold text-[#635bff] mb-2">$2.5B</div>
                <div className="text-sm text-slate-500 font-medium">Refunds Processed</div>
              </Card>
              <Card className="p-8 text-center border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
                <div className="text-4xl font-bold text-[#635bff] mb-2">99.9%</div>
                <div className="text-sm text-slate-500 font-medium">Accuracy Rate</div>
              </Card>
              <Card className="p-8 text-center border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
                <div className="text-4xl font-bold text-[#635bff] mb-2">4.9/5</div>
                <div className="text-sm text-slate-500 font-medium">User Rating</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-[#f6f9fc] clip-diagonal">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 text-[#0a2540]">Our Values</h2>
            <p className="text-lg text-slate-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card
                key={value.title}
                className="p-8 border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#635bff]/10 flex items-center justify-center mb-6">
                  <value.icon className="h-6 w-6 text-[#635bff]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#0a2540]">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 text-[#0a2540]">Our Journey</h2>
            <p className="text-lg text-slate-600">Key milestones in our mission to transform tax filing</p>
          </div>
          <div className="space-y-8 relative before:absolute before:left-[103px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-8 items-center relative">
                <div className="flex-shrink-0 w-20 text-right">
                  <div className="text-xl font-bold text-[#635bff]">{milestone.year}</div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#635bff] border-4 border-white shadow-sm z-10" />
                <Card className="flex-1 p-6 border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                  <p className="text-lg text-[#0a2540] font-medium">{milestone.event}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-[#f6f9fc] clip-diagonal">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 text-[#0a2540]">Leadership Team</h2>
            <p className="text-lg text-slate-600">Meet the people building the future of tax filing</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <Card
                key={member.name}
                className="p-8 text-center border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] mx-auto mb-6 flex items-center justify-center p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Users className="h-10 w-10 text-[#635bff]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 text-[#0a2540]">{member.name}</h3>
                <div className="text-sm text-[#635bff] font-semibold mb-4 uppercase tracking-wide">{member.role}</div>
                <p className="text-sm text-slate-600 leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#0a2540] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#635bff]/20 to-transparent"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Join Us on Our Mission</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Whether you're looking to file your taxes or join our team, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/get-started">
              <Button className="rounded-full bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] px-8 py-6 text-lg font-semibold transition-all duration-300">
                Start Filing Today
              </Button>
            </Link>
            <Link href="/careers">
              <Button
                variant="outline"
                className="rounded-full border-blue-200 text-blue-100 hover:bg-blue-900/50 hover:text-white px-8 py-6 text-lg transition-all duration-300 bg-transparent"
              >
                View Open Positions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
