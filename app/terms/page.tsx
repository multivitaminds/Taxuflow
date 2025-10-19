import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <FileText className="h-4 w-4" />
            Legal
          </div>
          <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-lg text-muted-foreground mb-8">Last updated: January 15, 2025</p>

          <Card className="p-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Taxu's services, you accept and agree to be bound by the terms and provision of
                this agreement. If you do not agree to these Terms of Service, please do not use our services.
              </p>

              <h2>2. Description of Service</h2>
              <p>Taxu provides AI-powered tax preparation and filing services ("Service"). The Service includes:</p>
              <ul>
                <li>Tax return preparation and filing</li>
                <li>AI-powered tax assistance and recommendations</li>
                <li>Document processing and storage</li>
                <li>Refund tracking and estimation</li>
                <li>Tax planning and optimization tools</li>
              </ul>

              <h2>3. User Accounts</h2>
              <p>To use our Service, you must create an account. You are responsible for:</p>
              <ul>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate, current, and complete information during registration</li>
                <li>Updating your information to maintain its accuracy and completeness</li>
              </ul>

              <h2>4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Provide false, inaccurate, or misleading information to the IRS or tax authorities</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                <li>Use automated systems to access the Service without our permission</li>
              </ul>

              <h2>5. Tax Filing and Accuracy</h2>
              <p>While Taxu uses advanced AI technology to assist with tax preparation:</p>
              <ul>
                <li>You are ultimately responsible for the accuracy of your tax return</li>
                <li>You should review all information before submitting to the IRS</li>
                <li>Taxu provides tools and guidance but does not provide legal or tax advice</li>
                <li>We recommend consulting with a tax professional for complex situations</li>
              </ul>

              <h2>6. Fees and Payment</h2>
              <p>Certain features of the Service require payment. By using paid features:</p>
              <ul>
                <li>You agree to pay all fees associated with your selected plan</li>
                <li>Fees are non-refundable except as required by law</li>
                <li>We reserve the right to change our pricing with 30 days' notice</li>
                <li>Failure to pay may result in suspension or termination of your account</li>
              </ul>

              <h2>7. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by Taxu and are protected by
                international copyright, trademark, and other intellectual property laws.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, Taxu shall not be liable for:</p>
              <ul>
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or use incurred by you or any third party</li>
                <li>Damages resulting from IRS audits, penalties, or interest charges</li>
                <li>Any damages arising from your use or inability to use the Service</li>
              </ul>

              <h2>9. Indemnification</h2>
              <p>
                You agree to indemnify and hold Taxu harmless from any claims, damages, losses, liabilities, and
                expenses arising from:
              </p>
              <ul>
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any inaccurate or false information you provide to tax authorities</li>
              </ul>

              <h2>10. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice,
                for:
              </p>
              <ul>
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Non-payment of fees</li>
                <li>Any other reason at our sole discretion</li>
              </ul>

              <h2>11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the
                new Terms on this page and updating the "Last updated" date. Your continued use of the Service after
                changes constitutes acceptance of the new Terms.
              </p>

              <h2>12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California,
                without regard to its conflict of law provisions.
              </p>

              <h2>13. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p>
                Email: legal@taxu.ai
                <br />
                Address: 123 Innovation Drive, San Francisco, CA 94105
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
