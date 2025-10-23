import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Shield,
  Lock,
  FileCheck,
  Server,
  CheckCircle,
  AlertTriangle,
  Key,
  Database,
  Cloud,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function SecurityDocsPage() {
  const sections = [
    {
      id: "encryption",
      title: "Encryption Standards",
      icon: Lock,
      content: [
        {
          subtitle: "Data at Rest",
          description:
            "All data stored in our databases is encrypted using AES-256-GCM encryption. Each user's data is encrypted with a unique encryption key derived from their account credentials using PBKDF2 with 100,000 iterations.",
          technical: [
            "Algorithm: AES-256-GCM (Galois/Counter Mode)",
            "Key derivation: PBKDF2-SHA256 with 100,000 iterations",
            "Salt: 32-byte cryptographically random salt per user",
            "IV: 12-byte random initialization vector per encryption operation",
          ],
        },
        {
          subtitle: "Data in Transit",
          description:
            "All network communication uses TLS 1.3 with perfect forward secrecy. We enforce HTTPS for all connections and use HSTS to prevent downgrade attacks.",
          technical: [
            "Protocol: TLS 1.3 (minimum TLS 1.2)",
            "Cipher suites: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256",
            "Certificate: RSA 4096-bit with SHA-256",
            "HSTS: max-age=31536000; includeSubDomains; preload",
          ],
        },
        {
          subtitle: "Zero-Knowledge Architecture",
          description:
            "Your documents are encrypted client-side before upload. We never have access to your unencrypted data. Only you hold the decryption keys.",
          technical: [
            "Client-side encryption using Web Crypto API",
            "Key derivation from user password + server-provided salt",
            "Server stores only encrypted data and cannot decrypt",
            "End-to-end encryption for document storage",
          ],
        },
      ],
    },
    {
      id: "authentication",
      title: "Authentication & Access Control",
      icon: Key,
      content: [
        {
          subtitle: "Multi-Factor Authentication",
          description:
            "We support multiple 2FA methods including TOTP authenticator apps, SMS codes, and biometric authentication.",
          technical: [
            "TOTP: RFC 6238 compliant with 30-second time windows",
            "SMS: Twilio Verify API with rate limiting",
            "Biometric: WebAuthn/FIDO2 for hardware keys and platform authenticators",
            "Backup codes: 10 single-use recovery codes per user",
          ],
        },
        {
          subtitle: "Session Management",
          description: "Secure session handling with automatic expiration, device tracking, and anomaly detection.",
          technical: [
            "Session tokens: 256-bit cryptographically random",
            "Expiration: 24 hours of inactivity, 7 days maximum",
            "Storage: HttpOnly, Secure, SameSite=Strict cookies",
            "Device fingerprinting for anomaly detection",
          ],
        },
        {
          subtitle: "Password Security",
          description:
            "Passwords are hashed using Argon2id, the winner of the Password Hashing Competition and recommended by OWASP.",
          technical: [
            "Algorithm: Argon2id",
            "Memory cost: 64 MB",
            "Time cost: 3 iterations",
            "Parallelism: 4 threads",
            "Salt: 16-byte cryptographically random per password",
          ],
        },
      ],
    },
    {
      id: "infrastructure",
      title: "Infrastructure Security",
      icon: Server,
      content: [
        {
          subtitle: "Cloud Architecture",
          description:
            "Hosted on AWS with multi-region redundancy and automatic failover. All infrastructure follows AWS Well-Architected Framework security pillar.",
          technical: [
            "Hosting: AWS (us-east-1 primary, us-west-2 failover)",
            "Compute: ECS Fargate with auto-scaling",
            "Database: RDS PostgreSQL with encryption at rest",
            "Storage: S3 with server-side encryption (SSE-KMS)",
            "CDN: CloudFront with AWS Shield Standard DDoS protection",
          ],
        },
        {
          subtitle: "Network Security",
          description:
            "Private VPC with network segmentation, security groups, and network ACLs. All services communicate over private subnets.",
          technical: [
            "VPC: Isolated virtual private cloud",
            "Subnets: Public (load balancers only) and private (application/database)",
            "Security groups: Least-privilege firewall rules",
            "WAF: AWS WAF with OWASP Top 10 protection",
          ],
        },
        {
          subtitle: "Monitoring & Logging",
          description: "Comprehensive logging and monitoring with real-time alerting for security events.",
          technical: [
            "Logging: CloudWatch Logs with 90-day retention",
            "Metrics: CloudWatch metrics with custom dashboards",
            "Alerting: SNS notifications for security events",
            "SIEM: Integration with security information and event management",
          ],
        },
      ],
    },
    {
      id: "compliance",
      title: "Compliance & Certifications",
      icon: FileCheck,
      content: [
        {
          subtitle: "SOC 2 Compliance In Progress",
          description:
            "Working towards independent audit by a third-party CPA firm for security, availability, and confidentiality controls.",
          technical: [
            "Audit period: In progress",
            "Trust service criteria: Security, Availability, Confidentiality",
            "Target completion: 2025",
            "Report available: Upon completion",
          ],
        },
        {
          subtitle: "IRS e-file Compliance",
          description:
            "Authorized IRS e-file provider meeting all Publication 1075 requirements for federal tax information.",
          technical: [
            "IRS Publication 1075: Safeguarding Federal Tax Information",
            "EFIN: Electronic Filing Identification Number issued by IRS",
            "Annual security review by IRS",
            "Incident reporting within 24 hours",
          ],
        },
        {
          subtitle: "Data Privacy Regulations",
          description: "Compliant with CCPA, GDPR, and other data privacy regulations.",
          technical: [
            "CCPA: California Consumer Privacy Act compliance",
            "GDPR: General Data Protection Regulation (EU)",
            "Data subject rights: Access, deletion, portability, correction",
            "Privacy policy: Updated annually, available at /privacy",
          ],
        },
        {
          subtitle: "Financial Regulations",
          description: "Adherence to financial industry security standards.",
          technical: [
            "GLBA: Gramm-Leach-Bliley Act compliance",
            "PCI DSS: Level 1 Service Provider (via Stripe)",
            "Payment processing: Stripe handles all payment data",
            "No storage of credit card numbers",
          ],
        },
      ],
    },
    {
      id: "incident-response",
      title: "Incident Response",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Security Incident Response Plan",
          description: "Documented procedures for detecting, responding to, and recovering from security incidents.",
          technical: [
            "Detection: Automated monitoring and alerting",
            "Response time: < 1 hour for critical incidents",
            "Escalation: On-call security team 24/7",
            "Communication: User notification within 72 hours if required",
          ],
        },
        {
          subtitle: "Vulnerability Management",
          description: "Regular security assessments and prompt patching of vulnerabilities.",
          technical: [
            "Vulnerability scanning: Weekly automated scans",
            "Penetration testing: Annual third-party pen tests",
            "Bug bounty: HackerOne program for responsible disclosure",
            "Patch management: Critical patches within 24 hours",
          ],
        },
        {
          subtitle: "Disaster Recovery",
          description: "Comprehensive backup and recovery procedures to ensure business continuity.",
          technical: [
            "Backups: Automated daily backups with 30-day retention",
            "RTO: Recovery Time Objective < 4 hours",
            "RPO: Recovery Point Objective < 1 hour",
            "Testing: Quarterly disaster recovery drills",
          ],
        },
      ],
    },
    {
      id: "api-security",
      title: "API Security",
      icon: Cloud,
      content: [
        {
          subtitle: "API Authentication",
          description: "Secure API access using API keys with rate limiting and IP whitelisting.",
          technical: [
            "Authentication: Bearer token (API key) in Authorization header",
            "Key format: pk_live_... (production), pk_test_... (test)",
            "Key rotation: Supported, recommended every 90 days",
            "Scopes: Granular permissions per API key",
          ],
        },
        {
          subtitle: "Rate Limiting",
          description: "Protection against abuse with tiered rate limits based on plan.",
          technical: [
            "Free tier: 100 requests/minute, 10,000/month",
            "Pro tier: 1,000 requests/minute, 1,000,000/month",
            "Rate limit headers: X-RateLimit-Limit, X-RateLimit-Remaining",
            "Retry-After header on 429 responses",
          ],
        },
        {
          subtitle: "Input Validation",
          description: "Strict validation and sanitization of all API inputs to prevent injection attacks.",
          technical: [
            "Schema validation: JSON Schema for all endpoints",
            "SQL injection: Parameterized queries only",
            "XSS prevention: Content Security Policy and output encoding",
            "CSRF protection: SameSite cookies and CSRF tokens",
          ],
        },
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention & Deletion",
      icon: Database,
      content: [
        {
          subtitle: "Retention Policy",
          description: "We retain your data only as long as necessary for tax purposes and legal requirements.",
          technical: [
            "Active returns: Retained for 7 years (IRS requirement)",
            "Deleted accounts: 30-day grace period, then permanent deletion",
            "Backups: Encrypted backups retained for 30 days",
            "Logs: Security logs retained for 90 days",
          ],
        },
        {
          subtitle: "Data Deletion",
          description: "Secure deletion procedures ensure data cannot be recovered after deletion.",
          technical: [
            "Soft delete: 30-day recovery period",
            "Hard delete: Cryptographic erasure of encryption keys",
            "Backup deletion: Removed from all backups within 30 days",
            "Verification: Deletion confirmation provided to user",
          ],
        },
        {
          subtitle: "Data Portability",
          description: "Export your data in machine-readable formats at any time.",
          technical: [
            "Export format: JSON, PDF, CSV",
            "Includes: All tax returns, documents, and account data",
            "Delivery: Secure download link valid for 7 days",
            "Encryption: Optional password-protected ZIP",
          ],
        },
      ],
    },
  ]

  const downloads = [
    {
      title: "SOC 2 Compliance Status",
      description: "Current compliance progress (audit in progress)",
      icon: FileText,
      restricted: true,
    },
    {
      title: "Penetration Test Summary",
      description: "Executive summary of latest pen test",
      icon: FileText,
      restricted: true,
    },
    {
      title: "Security Whitepaper",
      description: "Technical overview of our security architecture",
      icon: FileText,
      restricted: false,
    },
    {
      title: "Compliance Certifications",
      description: "IRS certification and compliance status",
      icon: FileCheck,
      restricted: false,
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <Link
            href="/security"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Security
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-6">
            <FileText className="w-4 h-4" />
            Technical Documentation
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance leading-[1.1]">Security Documentation</h1>
          <p className="text-xl text-muted-foreground text-balance leading-relaxed">
            Comprehensive technical documentation of our security architecture, compliance certifications, and data
            protection measures.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-background-alt sticky top-0 z-10 border-b border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Jump to:</span>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm text-muted-foreground hover:text-accent transition-colors whitespace-nowrap"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl space-y-20">
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Section {sectionIndex + 1}</div>
                    <h2 className="text-3xl font-bold">{section.title}</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="rounded-2xl border border-border bg-card p-8">
                      <h3 className="text-2xl font-bold mb-4">{item.subtitle}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">{item.description}</p>

                      <div className="rounded-xl bg-muted/50 p-6 border border-border">
                        <div className="text-sm font-semibold text-accent mb-3">Technical Details</div>
                        <ul className="space-y-2">
                          {item.technical.map((tech, techIndex) => (
                            <li key={techIndex} className="flex items-start gap-3 text-sm">
                              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              <span className="font-mono text-muted-foreground">{tech}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Security Documents</h2>
            <p className="text-xl text-muted-foreground">Download our security reports and certifications</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {downloads.map((doc, index) => {
              const Icon = doc.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    {doc.restricted ? (
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        Request Access
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        Download
                        <Download className="ml-2 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Shield className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Questions About Our Security?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our security team is available to answer your questions and provide additional documentation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="glow-neon-strong">
                Contact Security Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Report Vulnerability
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
