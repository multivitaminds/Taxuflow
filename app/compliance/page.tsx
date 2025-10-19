import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Shield, Lock, FileCheck, Award } from "lucide-react"

export default function CompliancePage() {
  const certifications = [
    {
      icon: Award,
      title: "SOC 2 Type II",
      description: "Independently audited for security, availability, and confidentiality controls",
      status: "Certified",
    },
    {
      icon: Shield,
      title: "IRS e-file Provider",
      description: "Authorized IRS e-file provider meeting all federal requirements",
      status: "Authorized",
    },
    {
      icon: Lock,
      title: "PCI DSS Level 1",
      description: "Highest level of payment card industry data security compliance",
      status: "Compliant",
    },
    {
      icon: FileCheck,
      title: "GLBA Compliant",
      description: "Meets Gramm-Leach-Bliley Act requirements for financial data protection",
      status: "Compliant",
    },
  ]

  const standards = [
    {
      name: "IRS Publication 1075",
      description: "Safeguarding Federal Tax Information - strict guidelines for protecting taxpayer data",
    },
    {
      name: "NIST Cybersecurity Framework",
      description: "Industry-standard framework for managing cybersecurity risks",
    },
    {
      name: "CCPA",
      description: "California Consumer Privacy Act - comprehensive data privacy rights",
    },
    {
      name: "GDPR",
      description: "General Data Protection Regulation - EU data protection standards",
    },
    {
      name: "HIPAA",
      description: "Health Insurance Portability and Accountability Act - for health-related tax data",
    },
  ]

  const practices = [
    "Annual third-party security audits and penetration testing",
    "Continuous vulnerability scanning and patch management",
    "Employee background checks and security training",
    "Incident response and disaster recovery procedures",
    "Regular compliance reviews and policy updates",
    "Data encryption at rest and in transit",
    "Multi-factor authentication for all access",
    "Comprehensive audit logging and monitoring",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Compliance & Certifications
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Trusted, Certified,
            <span className="text-accent"> Compliant</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            We maintain the highest standards of security, privacy, and regulatory compliance to protect your sensitive
            tax information.
          </p>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Certifications & Authorizations</h2>
            <p className="text-lg text-muted-foreground">Independently verified security and compliance standards</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.title} className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center">
                      <cert.icon className="h-8 w-8 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{cert.title}</h3>
                      <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                        {cert.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{cert.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Compliance Standards</h2>
            <p className="text-lg text-muted-foreground">We adhere to industry-leading regulatory frameworks</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {standards.map((standard) => (
              <Card key={standard.name} className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{standard.name}</h3>
                    <p className="text-muted-foreground">{standard.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Security Practices</h2>
            <p className="text-lg text-muted-foreground">Comprehensive measures to protect your data</p>
          </div>
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {practices.map((practice, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{practice}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Audit Reports Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Audit Reports</h2>
            <p className="text-lg text-muted-foreground mb-8">Request copies of our compliance documentation</p>
          </div>
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">SOC 2 Type II Report</h3>
                  <p className="text-sm text-muted-foreground">Latest audit report - Updated Q4 2024</p>
                </div>
                <button className="text-accent hover:underline text-sm font-medium">Request Report</button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Penetration Test Results</h3>
                  <p className="text-sm text-muted-foreground">Third-party security assessment - Updated Q4 2024</p>
                </div>
                <button className="text-accent hover:underline text-sm font-medium">Request Report</button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Data Processing Agreement</h3>
                  <p className="text-sm text-muted-foreground">GDPR-compliant DPA template</p>
                </div>
                <button className="text-accent hover:underline text-sm font-medium">Download DPA</button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6 text-center">
              Enterprise customers can request additional compliance documentation by contacting{" "}
              <a href="mailto:compliance@taxu.ai" className="text-accent">
                compliance@taxu.ai
              </a>
            </p>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent/10 via-background to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Questions About Compliance?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our compliance team is here to answer your questions and provide additional documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:compliance@taxu.ai">
              <button className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors">
                Contact Compliance Team
              </button>
            </a>
            <a href="/security/docs">
              <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                View Security Docs
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
