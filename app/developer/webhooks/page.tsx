"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useState } from "react"
import { Copy, Check, Webhook, Zap, Shield, Clock, ChevronRight, ExternalLink } from "lucide-react"

export default function WebhooksPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("node")

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const verificationExamples = {
    node: `// Node.js with Express
const crypto = require('crypto');
const express = require('express');
const app = express();

// Middleware to capture raw body for signature verification
app.use('/webhooks/taxu', express.raw({ type: 'application/json' }));

app.post('/webhooks/taxu', (req, res) => {
  const signature = req.headers['x-taxu-signature'];
  const timestamp = req.headers['x-taxu-timestamp'];
  const secret = process.env.TAXU_WEBHOOK_SECRET;
  
  // Verify timestamp (prevent replay attacks)
  const timestampAge = Math.floor(Date.now() / 1000) - parseInt(timestamp);
  if (timestampAge > 300) { // 5 minutes
    return res.status(400).send('Timestamp too old');
  }
  
  // Verify signature
  const payload = \`\${timestamp}.\${req.body}\`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  if (!crypto.timingSafeEqual(
    Buffer.from(signature), 
    Buffer.from(expectedSignature)
  )) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the verified webhook
  const event = JSON.parse(req.body);
  
  switch(event.type) {
    case 'document.processed':
      handleDocumentProcessed(event.data.object);
      break;
    case 'tax.calculated':
      handleTaxCalculated(event.data.object);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }
  
  res.status(200).json({ received: true });
});`,
    python: `# Python with Flask
import hmac
import hashlib
import time
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhooks/taxu', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Taxu-Signature')
    timestamp = request.headers.get('X-Taxu-Timestamp')
    secret = os.environ.get('TAXU_WEBHOOK_SECRET')
    
    # Verify timestamp (prevent replay attacks)
    timestamp_age = int(time.time()) - int(timestamp)
    if timestamp_age > 300:  # 5 minutes
        return 'Timestamp too old', 400
    
    # Verify signature
    payload = f"{timestamp}.{request.data.decode('utf-8')}"
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        return 'Invalid signature', 401
    
    # Process the verified webhook
    event = request.json
    
    if event['type'] == 'document.processed':
        handle_document_processed(event['data']['object'])
    elif event['type'] == 'tax.calculated':
        handle_tax_calculated(event['data']['object'])
    
    return jsonify({'received': True}), 200`,
    ruby: `# Ruby with Sinatra
require 'sinatra'
require 'json'
require 'openssl'

post '/webhooks/taxu' do
  signature = request.env['HTTP_X_TAXU_SIGNATURE']
  timestamp = request.env['HTTP_X_TAXU_TIMESTAMP']
  secret = ENV['TAXU_WEBHOOK_SECRET']
  
  # Read raw body
  request.body.rewind
  payload_body = request.body.read
  
  # Verify timestamp (prevent replay attacks)
  timestamp_age = Time.now.to_i - timestamp.to_i
  halt 400, 'Timestamp too old' if timestamp_age > 300
  
  # Verify signature
  payload = "#{timestamp}.#{payload_body}"
  expected_signature = OpenSSL::HMAC.hexdigest(
    'sha256', 
    secret, 
    payload
  )
  
  halt 401, 'Invalid signature' unless Rack::Utils.secure_compare(
    signature, 
    expected_signature
  )
  
  # Process the verified webhook
  event = JSON.parse(payload_body)
  
  case event['type']
  when 'document.processed'
    handle_document_processed(event['data']['object'])
  when 'tax.calculated'
    handle_tax_calculated(event['data']['object'])
  end
  
  status 200
  { received: true }.to_json
end`,
  }

  const webhookEvents = [
    {
      category: "Tax Filing",
      events: [
        { name: "tax.form_created", description: "A new tax form has been created" },
        { name: "tax.form_filed", description: "Tax form has been successfully filed with IRS" },
        { name: "tax.form_accepted", description: "IRS has accepted the tax filing" },
        { name: "tax.form_rejected", description: "IRS rejected the tax filing with errors" },
        { name: "tax.refund_issued", description: "Tax refund has been issued" },
        { name: "tax.payment_processed", description: "Tax payment has been processed" },
      ],
    },
    {
      category: "Document Processing",
      events: [
        { name: "document.uploaded", description: "Document successfully uploaded to system" },
        { name: "document.processing", description: "Document AI processing has started" },
        { name: "document.processed", description: "Document processing completed successfully" },
        { name: "document.failed", description: "Document processing failed" },
        { name: "document.ocr_complete", description: "OCR extraction completed" },
        { name: "document.classified", description: "Document type classified by AI" },
      ],
    },
    {
      category: "Accounting",
      events: [
        { name: "invoice.created", description: "New invoice created" },
        { name: "invoice.sent", description: "Invoice sent to customer" },
        { name: "invoice.paid", description: "Invoice marked as paid" },
        { name: "invoice.overdue", description: "Invoice is overdue" },
        { name: "expense.created", description: "New expense recorded" },
        { name: "transaction.categorized", description: "Transaction auto-categorized" },
      ],
    },
    {
      category: "Neobank",
      events: [
        { name: "account.created", description: "New bank account created" },
        { name: "transaction.created", description: "New transaction recorded" },
        { name: "payment.succeeded", description: "Payment completed successfully" },
        { name: "payment.failed", description: "Payment failed" },
        { name: "transfer.completed", description: "Transfer completed" },
        { name: "card.issued", description: "New card issued to user" },
      ],
    },
    {
      category: "Investment",
      events: [
        { name: "portfolio.created", description: "Investment portfolio created" },
        { name: "trade.executed", description: "Trade order executed" },
        { name: "dividend.received", description: "Dividend payment received" },
        { name: "tax_lot.created", description: "New tax lot recorded" },
        { name: "gains.calculated", description: "Capital gains/losses calculated" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2540] via-[#1e3a5f] to-[#0a2540]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative container mx-auto px-6 py-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#635bff]/10 rounded-xl backdrop-blur-sm border border-[#635bff]/20">
              <Webhook className="w-8 h-8 text-[#635bff]" />
            </div>
            <Badge variant="secondary" className="bg-[#635bff]/10 text-[#a0d7ff] border-[#635bff]/20">
              Real-time Events
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Webhooks</h1>
          <p className="text-xl text-slate-300 max-w-3xl mb-8 leading-relaxed">
            Receive real-time HTTP notifications when events occur in your Taxu account. Build reactive, event-driven
            integrations across all four platforms.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/developer-portal/webhooks">
              <Button size="lg" className="bg-[#635bff] hover:bg-[#0a2540] text-white gap-2">
                Manage Webhooks
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/developer/shell">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2"
              >
                Test in Shell
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#0a2540] mb-8">How Webhooks Work</h2>
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="p-6 border-2 border-slate-200 hover:border-[#635bff] hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white text-xl font-bold shadow-lg">
                  1
                </div>
                <Zap className="w-6 h-6 text-[#635bff]" />
              </div>
              <h3 className="text-lg font-bold text-[#0a2540] mb-2">Configure Endpoint</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Set up a URL on your server to receive webhook events. Supports HTTPS endpoints with custom headers and
                authentication.
              </p>
            </Card>

            <Card className="p-6 border-2 border-slate-200 hover:border-[#635bff] hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white text-xl font-bold shadow-lg">
                  2
                </div>
                <Shield className="w-6 h-6 text-[#635bff]" />
              </div>
              <h3 className="text-lg font-bold text-[#0a2540] mb-2">Subscribe to Events</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose which events to receive from Tax Filing, Accounting, Neobank, and Investment platforms. Granular
                control per endpoint.
              </p>
            </Card>

            <Card className="p-6 border-2 border-slate-200 hover:border-[#635bff] hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white text-xl font-bold shadow-lg">
                  3
                </div>
                <Clock className="w-6 h-6 text-[#635bff]" />
              </div>
              <h3 className="text-lg font-bold text-[#0a2540] mb-2">Receive Notifications</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get real-time POST requests when events occur. Automatic retries with exponential backoff for failed
                deliveries.
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a2540] mb-2">Real-time, Event-Driven Architecture</h3>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                  Webhooks enable you to build reactive integrations that respond instantly to changes. Instead of
                  polling the API every few minutes, Taxu pushes data to your server the moment something happens.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                    Average delivery time: <strong>{"<"}100ms</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                    Automatic retries with exponential backoff
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                    Guaranteed delivery with 24-hour retry window
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Available Events */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#0a2540] mb-8">Available Events</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Subscribe to events across all four Taxu platforms. Each event includes detailed payload data specific to
            the action that occurred.
          </p>

          <div className="space-y-6">
            {webhookEvents.map((category) => (
              <Card key={category.category} className="overflow-hidden border-2 border-slate-200">
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-[#0a2540]">{category.category}</h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {category.events.map((event) => (
                      <div
                        key={event.name}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="mt-0.5">
                          <div className="w-2 h-2 bg-[#635bff] rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <code className="text-sm font-mono text-[#635bff] font-semibold">{event.name}</code>
                          <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Webhook Payload Example */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#0a2540] mb-8">Webhook Payload</h2>
          <p className="text-slate-600 mb-6 text-lg">
            All webhook events follow a consistent structure with event metadata and typed payload data.
          </p>

          <Card className="overflow-hidden border-2 border-slate-200">
            <div className="bg-[#0a2540] px-6 py-3 flex items-center justify-between">
              <span className="text-sm font-mono text-slate-300">POST /your-webhook-endpoint</span>
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-white/10"
                onClick={() =>
                  copyToClipboard(
                    JSON.stringify(
                      {
                        id: "evt_1234567890abcdef",
                        object: "event",
                        type: "document.processed",
                        created: 1704067200,
                        livemode: true,
                        data: {
                          object: {
                            id: "doc_abc123",
                            object: "document",
                            status: "completed",
                            document_type: "w2",
                            ai_confidence: 0.96,
                            extracted_data: {
                              employer_name: "Acme Corporation",
                              employee_name: "John Doe",
                              wages: 75000.0,
                              federal_tax_withheld: 12500.0,
                              social_security_wages: 75000.0,
                              medicare_wages: 75000.0,
                            },
                          },
                        },
                      },
                      null,
                      2,
                    ),
                    "payload",
                  )
                }
              >
                {copiedCode === "payload" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="bg-[#1e293b] p-6 overflow-x-auto">
              <pre className="text-sm text-slate-300 font-mono leading-relaxed">
                <code>{`{
  "id": "evt_1234567890abcdef",
  "object": "event",
  "type": "document.processed",
  "created": 1704067200,
  "livemode": true,
  "data": {
    "object": {
      "id": "doc_abc123",
      "object": "document",
      "status": "completed",
      "document_type": "w2",
      "ai_confidence": 0.96,
      "extracted_data": {
        "employer_name": "Acme Corporation",
        "employee_name": "John Doe",
        "wages": 75000.00,
        "federal_tax_withheld": 12500.00,
        "social_security_wages": 75000.00,
        "medicare_wages": 75000.00
      }
    }
  }
}`}</code>
              </pre>
            </div>
          </Card>
        </section>

        {/* Verifying Signatures */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#0a2540] mb-8">Verifying Webhook Signatures</h2>
          <p className="text-slate-600 mb-6 text-lg">
            Taxu signs all webhook requests with HMAC-SHA256. Always verify signatures to ensure requests are authentic
            and prevent replay attacks.
          </p>

          <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="node">Node.js</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="ruby">Ruby</TabsTrigger>
            </TabsList>

            {Object.entries(verificationExamples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang}>
                <Card className="overflow-hidden border-2 border-slate-200">
                  <div className="bg-[#0a2540] px-6 py-3 flex items-center justify-between">
                    <span className="text-sm font-mono text-slate-300 capitalize">{lang} Implementation</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-white/10"
                      onClick={() => copyToClipboard(code, `verify-${lang}`)}
                    >
                      {copiedCode === `verify-${lang}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="bg-[#1e293b] p-6 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono leading-relaxed">
                      <code>{code}</code>
                    </pre>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="p-6 bg-amber-50 border-2 border-amber-200">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">Security Best Practice</h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Always verify webhook signatures in production. The webhook secret is provided when you create an
                  endpoint and should be stored securely in your environment variables.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Best Practices */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#0a2540] mb-8">Best Practices</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 border-2 border-slate-200 hover:border-[#635bff] hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0a2540]">Return 200 Quickly</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Respond with HTTP 200 within 5 seconds to acknowledge receipt. Process the event asynchronously using a
                job queue if needed. Taxu will retry if no 200 response is received.
              </p>
            </Card>

            <Card className="p-6 border-2 border-slate-200 hover:border-[#635bff] hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0a2540]">Handle Duplicates</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use the event ID to ensure idempotency. The same event may be sent multiple times due to network issues
                or retries. Store processed event IDs to prevent duplicate processing.
              </p>
            </Card>

            <Card className="p-6 border-2 border-slate-200 hover:border-[#635bff] hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0a2540]">Verify Signatures</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Always verify the HMAC signature and timestamp to ensure requests are from Taxu. Reject requests with
                timestamps older than 5 minutes to prevent replay attacks.
              </p>
            </Card>

            <Card className="p-6 border-2 border-slate-200 hover:border-[#635bff] hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0a2540]">Use HTTPS</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Webhook endpoints must use HTTPS in production for security. Use localhost tunneling tools like ngrok
                for local development testing.
              </p>
            </Card>
          </div>
        </section>

        {/* Retry Logic */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#0a2540] mb-8">Retry Logic</h2>
          <Card className="p-8 border-2 border-slate-200">
            <p className="text-slate-600 mb-6 leading-relaxed">
              Taxu automatically retries failed webhook deliveries using exponential backoff. If your endpoint returns a
              non-2xx status code or times out, we'll retry the delivery.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#0a2540]">Immediate retry</div>
                  <div className="text-sm text-slate-600">After initial failure</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#0a2540]">5 minutes later</div>
                  <div className="text-sm text-slate-600">Second retry attempt</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#0a2540]">30 minutes later</div>
                  <div className="text-sm text-slate-600">Third retry attempt</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white text-sm font-bold">
                  4
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#0a2540]">2 hours later</div>
                  <div className="text-sm text-slate-600">Fourth retry attempt</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white text-sm font-bold">
                  5
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#0a2540]">12 hours later</div>
                  <div className="text-sm text-slate-600">Final retry attempt before giving up</div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <section>
          <Card className="p-12 bg-gradient-to-br from-[#635bff] to-[#0a2540] border-0 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              Configure webhook endpoints and start receiving real-time notifications from all four Taxu platforms.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/developer-portal/webhooks">
                <Button size="lg" className="bg-white text-[#635bff] hover:bg-slate-100 gap-2">
                  Manage Webhooks
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/developer/docs/getting-started">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 gap-2"
                >
                  View Documentation
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
