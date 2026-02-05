import { Card } from "@/components/ui/card"
import { Database } from "lucide-react"

export default function DataUsagePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Database className="h-4 w-4" />
            Data Usage
          </div>
          <h1 className="text-5xl font-bold mb-6">Data Usage Policy</h1>
          <p className="text-lg text-muted-foreground mb-8">Last updated: January 15, 2025</p>

          <Card className="p-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>1. Overview</h2>
              <p>
                This Data Usage Policy explains how Taxu collects, processes, stores, and uses your data to provide our
                AI-powered tax filing services. We are committed to transparency about our data practices.
              </p>

              <h2>2. Data Collection</h2>
              <h3>Tax Information</h3>
              <p>We collect tax-related data including:</p>
              <ul>
                <li>Personal identification information (SSN, name, address)</li>
                <li>Income information (W-2s, 1099s, business income)</li>
                <li>Deduction and credit information</li>
                <li>Prior year tax returns</li>
                <li>Supporting documents and receipts</li>
              </ul>

              <h3>Financial Information</h3>
              <ul>
                <li>Bank account details for refund deposits</li>
                <li>Payment information for service fees</li>
                <li>Investment and retirement account information</li>
              </ul>

              <h3>Usage Data</h3>
              <ul>
                <li>How you interact with our platform</li>
                <li>Features and tools you use</li>
                <li>Time spent on different sections</li>
                <li>Device and browser information</li>
              </ul>

              <h2>3. AI and Machine Learning</h2>
              <h3>How We Use AI</h3>
              <p>Taxu uses artificial intelligence and machine learning to:</p>
              <ul>
                <li>Automatically extract information from uploaded tax documents</li>
                <li>Identify potential deductions and credits you may qualify for</li>
                <li>Provide personalized tax recommendations</li>
                <li>Answer tax questions through our AI assistant Sophie</li>
                <li>Detect errors and inconsistencies in tax returns</li>
                <li>Estimate refund amounts and tax liabilities</li>
              </ul>

              <h3>Training Data</h3>
              <p>We use aggregated, anonymized data to improve our AI models:</p>
              <ul>
                <li>Personal identifying information is removed before training</li>
                <li>Data is aggregated across thousands of users</li>
                <li>Individual tax returns cannot be reconstructed from training data</li>
                <li>You can opt out of having your data used for model training</li>
              </ul>

              <h2>4. Data Processing</h2>
              <h3>Automated Processing</h3>
              <p>We use automated systems to:</p>
              <ul>
                <li>Process and categorize uploaded documents</li>
                <li>Calculate tax obligations and refunds</li>
                <li>Generate tax forms and schedules</li>
                <li>Validate information for accuracy</li>
                <li>Flag potential audit risks</li>
              </ul>

              <h3>Human Review</h3>
              <p>In certain situations, trained tax professionals may review your information:</p>
              <ul>
                <li>Complex tax situations requiring expert judgment</li>
                <li>Quality assurance and accuracy checks</li>
                <li>Customer support inquiries</li>
                <li>Audit assistance requests</li>
              </ul>

              <h2>5. Data Storage</h2>
              <h3>Storage Infrastructure</h3>
              <ul>
                <li>Data is stored in SOC 2 Type II certified data centers</li>
                <li>Multiple geographic regions for redundancy</li>
                <li>Encrypted at rest using 256-bit AES encryption</li>
                <li>Regular backups with 99.99% durability</li>
              </ul>

              <h3>Data Segregation</h3>
              <ul>
                <li>Each user's data is logically isolated</li>
                <li>Sensitive data (SSN, bank accounts) stored in separate encrypted vaults</li>
                <li>Access controls based on least privilege principle</li>
                <li>Audit logs for all data access</li>
              </ul>

              <h2>6. Data Sharing</h2>
              <h3>Third-Party Services</h3>
              <p>We share data with trusted partners for:</p>
              <ul>
                <li>
                  <strong>IRS e-file:</strong> Transmitting tax returns to tax authorities
                </li>
                <li>
                  <strong>Payment processors:</strong> Processing service fees and refunds
                </li>
                <li>
                  <strong>Cloud providers:</strong> Hosting and infrastructure (AWS, Google Cloud)
                </li>
                <li>
                  <strong>Analytics:</strong> Understanding usage patterns (anonymized data only)
                </li>
              </ul>

              <h3>Data Sharing Controls</h3>
              <ul>
                <li>All third parties sign data processing agreements</li>
                <li>Regular security audits of partner systems</li>
                <li>Minimum necessary data shared for each purpose</li>
                <li>You can request a list of all data processors</li>
              </ul>

              <h2>7. Data Retention</h2>
              <h3>Retention Periods</h3>
              <ul>
                <li>
                  <strong>Tax returns:</strong> 7 years (IRS statute of limitations)
                </li>
                <li>
                  <strong>Supporting documents:</strong> 7 years
                </li>
                <li>
                  <strong>Account information:</strong> Duration of account + 7 years
                </li>
                <li>
                  <strong>Payment records:</strong> 7 years for tax purposes
                </li>
                <li>
                  <strong>Usage logs:</strong> 90 days (operational), 2 years (security)
                </li>
              </ul>

              <h3>Data Deletion</h3>
              <p>You can request deletion of your data, subject to:</p>
              <ul>
                <li>Legal requirements to retain tax records</li>
                <li>Ongoing tax filing or audit processes</li>
                <li>Outstanding payment obligations</li>
                <li>Fraud prevention and security needs</li>
              </ul>

              <h2>8. Data Access and Control</h2>
              <h3>Your Rights</h3>
              <ul>
                <li>
                  <strong>Access:</strong> View all data we have about you
                </li>
                <li>
                  <strong>Correction:</strong> Update inaccurate information
                </li>
                <li>
                  <strong>Export:</strong> Download your data in portable format
                </li>
                <li>
                  <strong>Deletion:</strong> Request removal of your data
                </li>
                <li>
                  <strong>Opt-out:</strong> Exclude data from AI training
                </li>
              </ul>

              <h3>Exercising Your Rights</h3>
              <p>To exercise these rights:</p>
              <ul>
                <li>Log in to your account and visit Settings → Privacy</li>
                <li>Email privacy@taxu.ai with your request</li>
                <li>Call 1-800-TAXU-HELP and speak with support</li>
              </ul>

              <h2>9. Data Security</h2>
              <h3>Technical Safeguards</h3>
              <ul>
                <li>End-to-end encryption for data in transit (TLS 1.3)</li>
                <li>256-bit AES encryption for data at rest</li>
                <li>Multi-factor authentication required for access</li>
                <li>Regular penetration testing and security audits</li>
                <li>Intrusion detection and prevention systems</li>
                <li>24/7 security monitoring and incident response</li>
              </ul>

              <h3>Organizational Safeguards</h3>
              <ul>
                <li>Background checks for all employees</li>
                <li>Regular security training and awareness programs</li>
                <li>Strict access controls and audit logging</li>
                <li>Incident response and breach notification procedures</li>
              </ul>

              <h2>10. Compliance</h2>
              <p>Our data practices comply with:</p>
              <ul>
                <li>IRS Publication 1075 (Safeguarding Tax Information)</li>
                <li>Gramm-Leach-Bliley Act (GLBA)</li>
                <li>California Consumer Privacy Act (CCPA)</li>
                <li>General Data Protection Regulation (GDPR) where applicable</li>
                <li>SOC 2 Type II standards</li>
                <li>PCI DSS for payment card data</li>
              </ul>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Data Usage Policy to reflect changes in our practices or legal requirements. We will
                notify you of material changes via email or prominent notice on our platform.
              </p>

              <h2>12. Contact Us</h2>
              <p>Questions about our data usage practices? Contact our Data Protection Officer:</p>
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
