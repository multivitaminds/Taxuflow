"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WebhooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-24 py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Webhooks</h1>
          <p className="text-lg text-muted-foreground">
            Receive real-time notifications when events occur in your Taxu account.
          </p>
        </div>

        <Card className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4">How Webhooks Work</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Webhooks allow you to receive HTTP POST notifications when specific events happen in your Taxu account.
              Instead of polling the API, Taxu will push data to your server in real-time.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="font-semibold mb-2">1. Configure Endpoint</h3>
                <p className="text-sm text-muted-foreground">Set up a URL on your server to receive webhook events</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <h3 className="font-semibold mb-2">2. Subscribe to Events</h3>
                <p className="text-sm text-muted-foreground">Choose which events you want to be notified about</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <h3 className="font-semibold mb-2">3. Receive Notifications</h3>
                <p className="text-sm text-muted-foreground">Get real-time POST requests when events occur</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4">Available Events</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>document.uploaded</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Triggered when a document is successfully uploaded</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>document.processed</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Triggered when AI document analysis is complete</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>document.failed</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Triggered when document processing fails</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>tax.calculated</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Triggered when a tax calculation is completed</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>invoice.created</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Triggered when a new invoice is created</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>invoice.paid</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Triggered when an invoice is marked as paid</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>customer.created</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Triggered when a new customer is added</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4">Webhook Payload Example</h2>
          <p className="text-muted-foreground mb-4">All webhook events follow this structure:</p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{String.raw`{
  "id": "evt_1234567890",
  "object": "event",
  "type": "document.processed",
  "created": 1704067200,
  "data": {
    "object": {
      "id": "doc_1234567890",
      "object": "document",
      "status": "completed",
      "document_type": "w2",
      "ai_confidence": 96,
      "extracted_data": {
        "employer_name": "Acme Corporation",
        "wages": 75000.00,
        "federal_tax_withheld": 12500.00
      }
    }
  }
}`}</code>
          </pre>
        </Card>

        <Card className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4">Verifying Webhook Signatures</h2>
          <p className="text-muted-foreground mb-4">
            Taxu signs all webhook requests with HMAC-SHA256. Verify the signature to ensure the request came from Taxu:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{String.raw`// Node.js example
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// In your webhook handler
app.post('/webhooks/taxu', (req, res) => {
  const signature = req.headers['x-taxu-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook
  const event = req.body;
  console.log('Received event:', event.type);
  
  res.status(200).send('OK');
});`}</code>
          </pre>
          <p className="text-sm text-muted-foreground">
            The webhook secret is provided when you create a webhook endpoint in the dashboard.
          </p>
        </Card>

        <Card className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          <div className="space-y-3">
            <div className="border-l-2 border-primary pl-4">
              <h3 className="font-semibold mb-1">Return 200 Quickly</h3>
              <p className="text-sm text-muted-foreground">
                Respond with HTTP 200 within 5 seconds. Process the event asynchronously if needed.
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <h3 className="font-semibold mb-1">Handle Duplicates</h3>
              <p className="text-sm text-muted-foreground">
                Use the event ID to ensure idempotency. The same event may be sent multiple times.
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <h3 className="font-semibold mb-1">Verify Signatures</h3>
              <p className="text-sm text-muted-foreground">
                Always verify the HMAC signature to ensure requests are from Taxu.
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <h3 className="font-semibold mb-1">Use HTTPS</h3>
              <p className="text-sm text-muted-foreground">
                Webhook endpoints must use HTTPS in production for security.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold mb-4">Manage Webhooks</h2>
          <p className="text-muted-foreground mb-4">
            Configure webhook endpoints and view delivery logs in the developer dashboard.
          </p>
          <Link href="/developer-portal/webhooks">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              Go to Webhook Settings
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
