import { Card } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Privacy
          </div>
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground mb-8">Last updated: January 15, 2025</p>

          <Card className="p-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>1. Introduction</h2>
              <p>
                At Taxu, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our tax filing services.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>We collect information that you provide directly to us:</p>
              <ul>
                <li>Name, email address, phone number, and mailing address</li>
                <li>Social Security Number (SSN) or Tax Identification Number (TIN)</li>
                <li>Date of birth and citizenship status</li>
                <li>Employment and income information</li>
                <li>Banking information for refund deposits</li>
                <li>Tax documents (W-2s, 1099s, receipts, etc.)</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <ul>
                <li>Device information (IP address, browser type, OS)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (with your permission)</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Prepare and file your tax returns</li>
                <li>Provide AI-powered tax assistance and recommendations</li>
                <li>Process payments and issue refunds</li>
                <li>Communicate with you about your account and services</li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal obligations and tax regulations</li>
                <li>Detect and prevent fraud and security threats</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>

              <h2>4. Information Sharing and Disclosure</h2>
              <p>We may share your information with:</p>

              <h3>Tax Authorities</h3>
              <p>
                We transmit your tax return information to the IRS and state tax agencies as necessary to file your
                returns.
              </p>

              <h3>Service Providers</h3>
              <p>We work with third-party service providers who assist us with:</p>
              <ul>
                <li>Cloud hosting and data storage</li>
                <li>Payment processing</li>
                <li>Customer support</li>
                <li>Analytics and performance monitoring</li>
                <li>Marketing and communications</li>
              </ul>

              <h3>Legal Requirements</h3>
              <p>We may disclose your information when required by law or to:</p>
              <ul>
                <li>Comply with legal processes or government requests</li>
                <li>Enforce our Terms of Service</li>
                <li>Protect our rights, property, or safety</li>
                <li>Investigate fraud or security issues</li>
              </ul>

              <h3>Business Transfers</h3>
              <p>
                If Taxu is involved in a merger, acquisition, or sale of assets, your information may be transferred as
                part of that transaction.
              </p>

              <h2>5. Data Security</h2>
              <p>We implement industry-leading security measures:</p>
              <ul>
                <li>256-bit AES encryption for data at rest and in transit</li>
                <li>Multi-factor authentication for account access</li>
                <li>Regular security audits and penetration testing</li>
                <li>SOC 2 Type II certified infrastructure</li>
                <li>Zero-knowledge architecture for sensitive data</li>
                <li>Employee background checks and security training</li>
                <li>24/7 security monitoring and incident response</li>
              </ul>

              <h2>6. Data Retention</h2>
              <p>We retain your information:</p>
              <ul>
                <li>Tax returns and supporting documents: 7 years (IRS requirement)</li>
                <li>Account information: Duration of account plus 7 years</li>
                <li>Marketing data: Until you opt out or request deletion</li>
                <li>Usage logs: 90 days for operational purposes, 2 years for security</li>
              </ul>

              <h2>7. Your Privacy Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data in a portable format</li>
                <li>Object to certain processing activities</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>

              <h2>8. California Privacy Rights (CCPA)</h2>
              <p>California residents have additional rights:</p>
              <ul>
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or disclosed</li>
                <li>Right to opt out of the sale of personal information</li>
                <li>Right to deletion of personal information</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
              </ul>

              <h2>9. Children's Privacy</h2>
              <p>
                Our Service is not intended for children under 18. We do not knowingly collect personal information from
                children. If you believe we have collected information from a child, please contact us immediately.
              </p>

              <h2>10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence.
                We ensure appropriate safeguards are in place for international transfers.
              </p>

              <h2>11. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Analyze usage patterns and improve our services</li>
                <li>Provide personalized content and recommendations</li>
                <li>Measure the effectiveness of marketing campaigns</li>
              </ul>
              <p>
                You can control cookies through your browser settings, but some features may not function properly if
                cookies are disabled.
              </p>

              <h2>12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2>13. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or our privacy practices, contact us at:</p>
              <p>
                Email: privacy@taxu.ai
                <br />
                Address: 123 Innovation Drive, San Francisco, CA 94105
                <br />
                Phone: 1-800-TAXU-HELP
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
