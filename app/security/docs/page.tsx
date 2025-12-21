"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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
  Copy,
  Check,
  Code2,
  Globe,
  Eye,
  Sparkles,
  Clock,
  Users,
  Award,
  Layers,
  TrendingUp,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { SyntaxHighlighter } from "@/components/developer/syntax-highlighter"

export default function SecurityDocsPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>("encryption")
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = (scrolled / documentHeight) * 100
      setScrollProgress(progress)

      // Update active section based on scroll position
      const sections = document.querySelectorAll('[id^="section-"]')
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          setActiveSection(section.id.replace("section-", ""))
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const sections = [
    {
      id: "encryption",
      title: "Encryption Standards",
      icon: Lock,
      gradient: "from-emerald-600 via-emerald-500 to-teal-600",
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
          codeExample: {
            language: "typescript",
            code: `import { createCipheriv, randomBytes, pbkdf2Sync } from 'crypto';

// Generate encryption key from password
const salt = randomBytes(32);
const key = pbkdf2Sync(password, salt, 100000, 32, 'sha256');

// Encrypt data with AES-256-GCM
const iv = randomBytes(12);
const cipher = createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
const authTag = cipher.getAuthTag();`,
          },
          badge: { text: "AES-256", color: "emerald" },
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
          codeExample: {
            language: "nginx",
            code: `# TLS 1.3 Configuration
ssl_protocols TLSv1.3 TLSv1.2;
ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;
ssl_prefer_server_ciphers off;

# HSTS Configuration
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;`,
          },
          badge: { text: "TLS 1.3", color: "blue" },
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
          codeExample: {
            language: "javascript",
            code: `// Client-side encryption before upload
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
  passwordKey,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"]
);

const encrypted = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  key,
  documentData
);`,
          },
          badge: { text: "Zero-Knowledge", color: "violet" },
        },
      ],
    },
    {
      id: "authentication",
      title: "Authentication & Access Control",
      icon: Key,
      gradient: "from-blue-600 via-blue-500 to-cyan-600",
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
          codeExample: {
            language: "typescript",
            code: `import { authenticator } from 'otplib';

// Generate TOTP secret
const secret = authenticator.generateSecret();

// Verify TOTP token
const token = req.body.token;
const isValid = authenticator.verify({ token, secret });

if (isValid) {
  // Grant access
  await createSession(user.id);
}`,
          },
          badge: { text: "MFA Enabled", color: "green" },
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
          codeExample: {
            language: "typescript",
            code: `// Create secure session
const sessionToken = randomBytes(32).toString('hex');
const session = await createSession({
  userId: user.id,
  token: sessionToken,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  deviceFingerprint: req.fingerprint
});

// Set secure cookie
res.cookie('session', sessionToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000
});`,
          },
          badge: { text: "Secure Sessions", color: "blue" },
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
          codeExample: {
            language: "typescript",
            code: `import argon2 from 'argon2';

// Hash password with Argon2id
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MB
  timeCost: 3,
  parallelism: 4
});

// Verify password
const isValid = await argon2.verify(hash, password);`,
          },
          badge: { text: "Argon2id", color: "violet" },
        },
      ],
    },
    {
      id: "infrastructure",
      title: "Infrastructure Security",
      icon: Server,
      gradient: "from-gray-600 via-gray-500 to-gray-700",
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
      gradient: "from-yellow-600 via-yellow-500 to-orange-600",
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
      gradient: "from-red-600 via-red-500 to-orange-600",
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
      gradient: "from-violet-600 via-violet-500 to-purple-600",
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
          codeExample: {
            language: "typescript",
            code: `// API Key Authentication
const response = await fetch('https://api.taxu.io/v1/tax/calculate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pk_live_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    income: 75000,
    filingStatus: 'single'
  })
});

const result = await response.json();`,
          },
          badge: { text: "API Keys", color: "purple" },
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
          codeExample: {
            language: "typescript",
            code: `// Rate limit response headers
{
  "X-RateLimit-Limit": "1000",
  "X-RateLimit-Remaining": "998",
  "X-RateLimit-Reset": "1640995200"
}

// Handle rate limiting
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  await sleep(retryAfter * 1000);
  // Retry request
}`,
          },
          badge: { text: "Rate Limited", color: "amber" },
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
          codeExample: {
            language: "typescript",
            code: `import { z } from 'zod';

// Request validation schema
const schema = z.object({
  income: z.number().positive().max(10000000),
  filingStatus: z.enum(['single', 'married', 'head_of_household']),
  deductions: z.object({
    standard: z.boolean()
  }).optional()
});

// Validate request
const validated = schema.parse(req.body);`,
          },
          badge: { text: "Validated", color: "green" },
        },
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention & Deletion",
      icon: Database,
      gradient: "from-indigo-600 via-indigo-500 to-blue-600",
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
      badge: "In Progress",
      badgeColor: "amber",
    },
    {
      title: "Penetration Test Summary",
      description: "Executive summary of latest pen test",
      icon: FileText,
      restricted: true,
      badge: "Restricted",
      badgeColor: "red",
    },
    {
      title: "Security Whitepaper",
      description: "Technical overview of our security architecture",
      icon: FileText,
      restricted: false,
      badge: "Public",
      badgeColor: "green",
    },
    {
      title: "Compliance Certifications",
      description: "IRS certification and compliance status",
      icon: FileCheck,
      restricted: false,
      badge: "Public",
      badgeColor: "green",
    },
  ]

  const stats = [
    {
      icon: Shield,
      label: "Security Incidents",
      value: "0",
      trend: "Last 12 months",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Clock,
      label: "Avg Response Time",
      value: "<1hr",
      trend: "Critical incidents",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Users,
      label: "Security Team",
      value: "24/7",
      trend: "Always available",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Award,
      label: "Compliance Rate",
      value: "100%",
      trend: "All requirements",
      color: "from-amber-500 to-orange-600",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#635bff] via-[#00d4ff] to-[#635bff] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,91,255,0.12),transparent_60%)] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,212,255,0.08),transparent_60%)] animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />

        <div
          className="absolute top-20 left-10 w-72 h-72 bg-[#635bff]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <Link
            href="/security"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#635bff] mb-8 transition-all group hover:gap-3"
          >
            <ArrowRight className="w-4 h-4 rotate-180 transition-transform" />
            <span className="font-semibold">Back to Security</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Badge className="bg-gradient-to-r from-[#635bff] to-[#5046e5] text-white border-0 px-5 py-2 text-sm shadow-lg hover:shadow-xl transition-shadow">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Enterprise-Grade Security
            </Badge>
            <Badge className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 text-emerald-700 px-5 py-2 text-sm hover:shadow-lg transition-shadow">
              <CheckCircle className="w-4 h-4 mr-2" />
              SOC 2 In Progress
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 text-blue-700 px-5 py-2 text-sm hover:shadow-lg transition-shadow">
              <Eye className="w-4 h-4 mr-2" />
              Transparency Report
            </Badge>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 text-balance leading-[1.05] bg-gradient-to-br from-[#0a2540] via-[#1a3555] to-[#0a2540] bg-clip-text text-transparent">
            Security Documentation
          </h1>
          <p className="text-2xl text-slate-600 text-balance leading-relaxed max-w-4xl mb-16 font-light">
            Comprehensive technical documentation of our security architecture, compliance certifications, and data
            protection measures. Built for enterprise scrutiny.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="relative p-8 bg-white border-2 hover:border-transparent transition-all duration-300 hover:shadow-2xl group overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-br from-[#0a2540] to-[#1a3555] bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-base font-bold text-slate-900 mb-1">{stat.label}</div>
                    <div className="text-sm text-slate-500">{stat.trend}</div>
                  </div>

                  <div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`}
                  />
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b-2 border-slate-200/50 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 pr-4 border-r-2 border-slate-200 flex-shrink-0">
              <Globe className="w-5 h-5 text-[#635bff]" />
              <span className="text-sm font-bold text-slate-900 whitespace-nowrap">Jump to:</span>
            </div>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#section-${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={`text-sm px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 font-semibold ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-[#635bff] to-[#5046e5] text-white shadow-lg scale-105"
                    : "text-slate-600 hover:text-[#635bff] hover:bg-slate-100"
                }`}
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="container mx-auto max-w-7xl space-y-32">
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <div key={section.id} id={`section-${section.id}`} className="scroll-mt-32">
                <div className="mb-16">
                  <div
                    className={`inline-flex items-center gap-6 mb-8 p-8 rounded-3xl bg-gradient-to-r ${section.gradient} shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] group`}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-xl">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-sm font-bold text-white/90 uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                          Section {sectionIndex + 1}
                        </div>
                        <TrendingUp className="w-4 h-4 text-white/80" />
                      </div>
                      <h2 className="text-5xl font-bold text-white text-balance leading-tight">{section.title}</h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  {section.content.map((item, itemIndex) => (
                    <Card
                      key={itemIndex}
                      className="overflow-hidden border-2 hover:border-[#635bff]/40 transition-all duration-300 hover:shadow-2xl group"
                    >
                      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 p-10 border-b-2">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div className="flex-1">
                            <h3 className="text-4xl font-bold bg-gradient-to-r from-[#0a2540] to-[#635bff] bg-clip-text text-transparent group-hover:from-[#635bff] group-hover:to-[#5046e5] transition-all duration-300 mb-3">
                              {item.subtitle}
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed">{item.description}</p>
                          </div>
                          {item.badge && (
                            <Badge
                              className={`${
                                item.badge.color === "emerald"
                                  ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-2 border-emerald-300"
                                  : item.badge.color === "blue"
                                    ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-2 border-blue-300"
                                    : item.badge.color === "violet"
                                      ? "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 border-2 border-violet-300"
                                      : item.badge.color === "green"
                                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300"
                                        : item.badge.color === "purple"
                                          ? "bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-800 border-2 border-purple-300"
                                          : "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-2 border-amber-300"
                              } px-5 py-2 text-sm font-bold shadow-lg flex-shrink-0 hover:scale-105 transition-transform`}
                            >
                              <Target className="w-4 h-4 mr-2" />
                              {item.badge.text}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="p-10 space-y-8 bg-white">
                        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-8 border-2 border-slate-200 shadow-inner">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#635bff] to-[#5046e5] flex items-center justify-center shadow-lg">
                              <Layers className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-base font-bold text-[#635bff] uppercase tracking-widest">
                              Technical Specifications
                            </div>
                          </div>
                          <ul className="space-y-4">
                            {item.technical.map((tech, techIndex) => (
                              <li key={techIndex} className="flex items-start gap-4 group/item">
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md group-hover/item:scale-110 transition-transform">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-mono text-base text-slate-800 leading-relaxed group-hover/item:text-slate-900 transition-colors">
                                  {tech}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {item.codeExample && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a2540] to-[#1a3555] flex items-center justify-center shadow-lg">
                                  <Code2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-base font-bold text-slate-900 uppercase tracking-widest">
                                  Implementation Example
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(item.codeExample!.code, `${section.id}-${itemIndex}`)}
                                className="h-10 px-5 text-sm font-semibold border-2 hover:border-[#635bff] hover:text-[#635bff] hover:bg-[#635bff]/5 transition-all"
                              >
                                {copied === `${section.id}-${itemIndex}` ? (
                                  <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Code
                                  </>
                                )}
                              </Button>
                            </div>
                            <div className="rounded-2xl overflow-hidden border-2 border-slate-300 shadow-2xl hover:shadow-3xl transition-shadow">
                              <div className="bg-gradient-to-r from-[#0a2540] to-[#1a3555] px-6 py-4 flex items-center gap-3">
                                <div className="flex gap-2">
                                  <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-lg" />
                                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-lg" />
                                  <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-lg" />
                                </div>
                                <span className="text-sm font-bold text-slate-300 ml-2">
                                  {item.codeExample.language}
                                </span>
                              </div>
                              <div className="bg-[#0d1729] p-8 overflow-x-auto">
                                <SyntaxHighlighter code={item.codeExample.code} language={item.codeExample.language} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#635bff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-[#635bff] to-[#5046e5] text-white border-0 px-6 py-3 mb-8 shadow-xl text-sm">
              <FileText className="w-5 h-5 mr-2" />
              Documentation & Reports
            </Badge>
            <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-[#0a2540] to-[#635bff] bg-clip-text text-transparent">
              Security Documents
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Download our security reports, compliance certifications, and technical whitepapers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {downloads.map((doc, index) => {
              const Icon = doc.icon
              return (
                <Card
                  key={index}
                  className="group p-10 border-2 hover:border-[#635bff]/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white"
                >
                  <div className="flex items-start gap-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#635bff] to-[#5046e5] flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-2xl font-bold text-[#0a2540] group-hover:text-[#635bff] transition-colors">
                          {doc.title}
                        </h3>
                        <Badge
                          className={`${
                            doc.badgeColor === "green"
                              ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-2 border-emerald-300"
                              : doc.badgeColor === "amber"
                                ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-2 border-amber-300"
                                : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300"
                          } px-4 py-2 font-bold text-sm shadow-md flex-shrink-0`}
                        >
                          {doc.badge}
                        </Badge>
                      </div>
                      <p className="text-base text-slate-600 mb-8 leading-relaxed">{doc.description}</p>
                      {doc.restricted ? (
                        <Button
                          size="lg"
                          variant="outline"
                          className="text-sm font-bold group/btn border-2 hover:border-[#635bff] hover:text-[#635bff] hover:bg-[#635bff]/5 transition-all bg-transparent"
                        >
                          Request Access
                          <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-[#635bff] to-[#5046e5] hover:from-[#5046e5] hover:to-[#635bff] text-white text-sm font-bold group/btn shadow-xl hover:shadow-2xl transition-all"
                        >
                          Download PDF
                          <Download className="ml-2 h-4 w-4 group-hover/btn:translate-y-1 transition-transform" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2540] via-[#1a3555] to-[#0a2540]" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,91,255,0.2),transparent_50%)] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,212,255,0.15),transparent_50%)] animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl mb-10 shadow-2xl group hover:scale-110 transition-transform duration-300">
              <Shield className="w-12 h-12 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h2 className="text-6xl font-bold mb-8 text-white leading-tight text-balance">
              Questions About Our Security?
            </h2>
            <p className="text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              Our security team is available 24/7 to answer your questions, provide additional documentation, and
              discuss enterprise security requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="bg-white text-[#0a2540] hover:bg-slate-100 shadow-2xl text-lg px-10 py-8 h-auto group hover:shadow-3xl transition-all font-bold"
              >
                Contact Security Team
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-xl text-lg px-10 py-8 h-auto group shadow-2xl bg-white/5 hover:border-white/60 transition-all font-bold"
              >
                Report Vulnerability
                <ExternalLink className="ml-3 h-6 w-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
