"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Zap, Shield, Code2, CheckCircle2, Terminal, Copy, ExternalLink } from "lucide-react"

export default function WebhooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-5xl mx-auto px-16 py-12 space-y-10">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Webhooks
            </h1>
          </div>
          <p className="text-xl text-slate-600 leading-relaxed">
            Receive real-time notifications when events occur in your Taxu account. Build reactive integrations with
            instant event delivery.
          </p>
        </div>

        {/* How Webhooks Work */}
        <Card className="p-8 border border-slate-200 shadow-xl bg-white/90 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Code2 className="w-7 h-7 text-blue-600" />
            How Webhooks Work
          </h2>
          <div className="space-y-6">
            <p className="text-slate-600 text-lg leading-relaxed">
              Webhooks allow you to receive HTTP POST notifications when specific events happen in your Taxu account.
              Instead of polling the API, Taxu will push data to your server in real-time.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600">
                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                <h3 className="font-semibold text-lg mb-2">Configure Endpoint</h3>
                <p className="text-sm text-slate-600">Set up a URL on your server to receive webhook events</p>
              </div>
              <div className="p-5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-indigo-600">
                <div className="text-2xl font-bold text-indigo-600 mb-2">2</div>
                <h3 className="font-semibold text-lg mb-2">Subscribe to Events</h3>
                <p className="text-sm text-slate-600">Choose which events you want to be notified about</p>
              </div>
              <div className="p-5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-violet-600">
                <div className="text-2xl font-bold text-violet-600 mb-2">3</div>
                <h3 className="font-semibold text-lg mb-2">Receive Notifications</h3>
                <p className="text-sm text-slate-600">Get real-time POST requests when events occur</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border border-emerald-200 shadow-xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Terminal className="w-7 h-7 text-emerald-600" />
            Trigger Webhook Events with Taxu CLI
          </h2>
          <div className="space-y-6">
            <p className="text-slate-600 text-lg leading-relaxed">
              Test your webhook integrations without waiting for real events. The Taxu CLI lets you trigger any webhook
              event instantly in sandbox mode.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  List All Available Events
                </h3>
                <p className="text-sm text-slate-600 mb-3">See all webhook events supported by the Taxu CLI:</p>
                <pre className="bg-slate-900 text-slate-100 p-5 rounded-lg overflow-x-auto text-sm shadow-lg border border-slate-700">
                  <code>
                    <span className="text-emerald-400">taxu</span> <span className="text-blue-400">trigger</span>{" "}
                    <span className="text-amber-400">--help</span>
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Trigger a Specific Event
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Trigger any event by replacing{" "}
                  <code className="px-2 py-1 bg-slate-200 rounded text-xs">&lt;EVENT&gt;</code> with the event name:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-5 rounded-lg overflow-x-auto text-sm shadow-lg border border-slate-700">
                  <code>
                    <span className="text-emerald-400">taxu</span> <span className="text-blue-400">trigger</span>{" "}
                    <span className="text-purple-400">&lt;EVENT&gt;</span>
                  </code>
                </pre>

                <p className="text-sm text-slate-600 mt-4 mb-3">For example, trigger a tax filing submission event:</p>
                <pre className="bg-slate-900 text-slate-100 p-5 rounded-lg overflow-x-auto text-sm shadow-lg border border-slate-700">
                  <code>
                    <span className="text-emerald-400">taxu</span> <span className="text-blue-400">trigger</span>{" "}
                    <span className="text-pink-400">tax.filing.submitted</span>
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Customize Event Data
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Override default parameters using the{" "}
                  <code className="px-2 py-1 bg-slate-200 rounded text-xs">--override</code> flag:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-5 rounded-lg overflow-x-auto text-sm shadow-lg border border-slate-700 space-y-2">
                  <code className="block">
                    <span className="text-slate-500"># Set a top-level parameter</span>
                  </code>
                  <code className="block">
                    <span className="text-emerald-400">taxu</span> <span className="text-blue-400">trigger</span>{" "}
                    <span className="text-pink-400">payment.succeeded</span>{" "}
                    <span className="text-amber-400">--override</span>{" "}
                    <span className="text-cyan-400">payment:amount</span>=<span className="text-yellow-300">5000</span>
                  </code>
                  <code className="block mt-3">
                    <span className="text-slate-500"># Set nested parameters</span>
                  </code>
                  <code className="block">
                    <span className="text-emerald-400">taxu</span> <span className="text-blue-400">trigger</span>{" "}
                    <span className="text-pink-400">tax.filing.accepted</span>{" "}
                    <span className="text-amber-400">--override</span>{" "}
                    <span className="text-cyan-400">filing:"taxpayer[ssn]"</span>=
                    <span className="text-yellow-300">123-45-6789</span>
                  </code>
                  <code className="block mt-3">
                    <span className="text-slate-500"># Multiple overrides</span>
                  </code>
                  <code className="block">
                    <span className="text-emerald-400">taxu</span> <span className="text-blue-400">trigger</span>{" "}
                    <span className="text-pink-400">document.processed</span> \
                  </code>
                  <code className="block">
                    {" "}
                    <span className="text-amber-400">--override</span>{" "}
                    <span className="text-cyan-400">document:type</span>=<span className="text-yellow-300">w2</span> \
                  </code>
                  <code className="block">
                    {" "}
                    <span className="text-amber-400">--override</span>{" "}
                    <span className="text-cyan-400">document:confidence</span>=
                    <span className="text-yellow-300">98</span>
                  </code>
                </pre>
              </div>

              <div className="p-5 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
                <p className="text-sm text-slate-700">
                  <strong className="text-blue-900">Note:</strong> The Taxu CLI automatically generates related events
                  when needed. For example, triggering{" "}
                  <code className="px-2 py-1 bg-white rounded text-xs">tax.filing.submitted</code> may also generate{" "}
                  <code className="px-2 py-1 bg-white rounded text-xs">tax.filing.created</code> first.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Available Events */}
        <Card className="p-8 border border-slate-200 shadow-xl bg-white/90 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Available Events</h2>
          <div className="space-y-6">
            {/* Tax Filing Events */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                Tax Filing Events
              </h3>
              <div className="grid gap-3">
                <EventCard event="tax.filing.created" description="Triggered when a new tax filing is created" />
                <EventCard
                  event="tax.filing.submitted"
                  description="Triggered when a tax return is submitted to the IRS"
                />
                <EventCard event="tax.filing.accepted" description="Triggered when the IRS accepts a tax return" />
                <EventCard event="tax.filing.rejected" description="Triggered when the IRS rejects a tax return" />
                <EventCard event="tax.filing.amended" description="Triggered when an amended return is filed" />
              </div>
            </div>

            {/* Payment Events */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                Payment Events
              </h3>
              <div className="grid gap-3">
                <EventCard event="payment.succeeded" description="Triggered when a payment is successfully processed" />
                <EventCard event="payment.failed" description="Triggered when a payment fails" />
                <EventCard event="payment.refunded" description="Triggered when a payment is refunded" />
              </div>
            </div>

            {/* Banking Events */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                Banking Events
              </h3>
              <div className="grid gap-3">
                <EventCard event="transaction.posted" description="Triggered when a bank transaction is posted" />
                <EventCard event="account.updated" description="Triggered when account information changes" />
                <EventCard event="transfer.completed" description="Triggered when a transfer completes" />
              </div>
            </div>

            {/* Document Events */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                Document Events
              </h3>
              <div className="grid gap-3">
                <EventCard event="document.uploaded" description="Triggered when a document is uploaded" />
                <EventCard event="document.processed" description="Triggered when document processing completes" />
                <EventCard event="document.verified" description="Triggered when a document is verified" />
              </div>
            </div>
          </div>
        </Card>

        {/* Webhook Payload Example */}
        <Card className="p-8 border border-slate-200 shadow-xl bg-white/90 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Webhook Payload Example</h2>
          <p className="text-slate-600 mb-4">All webhook events follow this structure:</p>
          <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm shadow-lg border border-slate-700">
            <code className="language-json">
              {`{
  `}
              <span className="text-cyan-400">"id"</span>
              {`: `}
              <span className="text-yellow-300">"evt_1234567890"</span>
              {`,
  `}
              <span className="text-cyan-400">"object"</span>
              {`: `}
              <span className="text-yellow-300">"event"</span>
              {`,
  `}
              <span className="text-cyan-400">"type"</span>
              {`: `}
              <span className="text-yellow-300">"tax.filing.submitted"</span>
              {`,
  `}
              <span className="text-cyan-400">"created"</span>
              {`: `}
              <span className="text-purple-400">1704067200</span>
              {`,
  `}
              <span className="text-cyan-400">"data"</span>
              {`: {
    `}
              <span className="text-cyan-400">"object"</span>
              {`: {
      `}
              <span className="text-cyan-400">"id"</span>
              {`: `}
              <span className="text-yellow-300">"filing_1234567890"</span>
              {`,
      `}
              <span className="text-cyan-400">"object"</span>
              {`: `}
              <span className="text-yellow-300">"tax_filing"</span>
              {`,
      `}
              <span className="text-cyan-400">"status"</span>
              {`: `}
              <span className="text-yellow-300">"submitted"</span>
              {`,
      `}
              <span className="text-cyan-400">"tax_year"</span>
              {`: `}
              <span className="text-purple-400">2024</span>
              {`,
      `}
              <span className="text-cyan-400">"filing_type"</span>
              {`: `}
              <span className="text-yellow-300">"1040"</span>
              {`,
      `}
              <span className="text-cyan-400">"submission_id"</span>
              {`: `}
              <span className="text-yellow-300">"sub_abc123xyz"</span>
              {`,
      `}
              <span className="text-cyan-400">"taxpayer"</span>
              {`: {
        `}
              <span className="text-cyan-400">"name"</span>
              {`: `}
              <span className="text-yellow-300">"John Doe"</span>
              {`,
        `}
              <span className="text-cyan-400">"ssn"</span>
              {`: `}
              <span className="text-yellow-300">"***-**-6789"</span>
              {`}
    }
  }
}`}
            </code>
          </pre>
        </Card>

        {/* Verifying Signatures */}
        <Card className="p-8 border border-slate-200 shadow-xl bg-white/90 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-7 h-7 text-blue-600" />
            Verifying Webhook Signatures
          </h2>
          <p className="text-slate-600 mb-6 text-lg">
            Taxu signs all webhook requests with HMAC-SHA256. Always verify the signature to ensure the request came
            from Taxu:
          </p>

          {/* Node.js Example */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Node.js Example</h3>
            <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm shadow-lg border border-slate-700">
              <code>{`<span className="text-purple-400">const</span> <span className="text-blue-400">crypto</span> = <span className="text-pink-400">require</span>(<span className="text-yellow-300">'crypto'</span>);

<span className="text-purple-400">function</span> <span className="text-emerald-400">verifyWebhookSignature</span>(<span className="text-orange-400">payload</span>, <span className="text-orange-400">signature</span>, <span className="text-orange-400">secret</span>) {
  <span className="text-purple-400">const</span> <span className="text-blue-400">hmac</span> = crypto.<span className="text-emerald-400">createHmac</span>(<span className="text-yellow-300">'sha256'</span>, secret);
  <span className="text-purple-400">const</span> <span className="text-blue-400">digest</span> = hmac.<span className="text-emerald-400">update</span>(payload).<span className="text-emerald-400">digest</span>(<span className="text-yellow-300">'hex'</span>);
  <span className="text-purple-400">return</span> crypto.<span className="text-emerald-400">timingSafeEqual</span>(
    Buffer.<span className="text-emerald-400">from</span>(signature),
    Buffer.<span className="text-emerald-400">from</span>(digest)
  );
}

<span className="text-slate-500">// In your webhook handler</span>
app.<span className="text-emerald-400">post</span>(<span className="text-yellow-300">'/webhooks/taxu'</span>, (<span className="text-orange-400">req</span>, <span className="text-orange-400">res</span>) => {
  <span className="text-purple-400">const</span> <span className="text-blue-400">signature</span> = req.headers[<span className="text-yellow-300">'x-taxu-signature'</span>];
  <span className="text-purple-400">const</span> <span className="text-blue-400">payload</span> = JSON.<span className="text-emerald-400">stringify</span>(req.body);
  
  <span className="text-purple-400">if</span> (!<span className="text-emerald-400">verifyWebhookSignature</span>(payload, signature, process.env.WEBHOOK_SECRET)) {
    <span className="text-purple-400">return</span> res.<span className="text-emerald-400">status</span>(<span className="text-purple-400">401</span>).<span className="text-emerald-400">send</span>(<span className="text-yellow-300">'Invalid signature'</span>);
  }
  
  <span className="text-slate-500">// Process the webhook</span>
  <span className="text-purple-400">const</span> <span className="text-blue-400">event</span> = req.body;
  console.<span className="text-emerald-400">log</span>(<span className="text-yellow-300">'Received event:'</span>, event.type);
  
  res.<span className="text-emerald-400">status</span>(<span className="text-purple-400">200</span>).<span className="text-emerald-400">send</span>(<span className="text-yellow-300">'OK'</span>);
});`}</code>
            </pre>
          </div>

          <div className="mt-6 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
            <p className="text-sm text-slate-700">
              <strong className="text-amber-900">Important:</strong> The webhook secret is provided when you create a
              webhook endpoint in the developer portal. Store it securely as an environment variable.
            </p>
          </div>
        </Card>

        {/* Best Practices */}
        <Card className="p-8 border border-slate-200 shadow-xl bg-white/90 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Best Practices</h2>
          <div className="grid gap-4">
            <BestPracticeCard
              title="Return 200 Quickly"
              description="Respond with HTTP 200 within 5 seconds. Process the event asynchronously if needed to avoid timeouts."
              icon="⚡"
            />
            <BestPracticeCard
              title="Handle Duplicates"
              description="Use the event ID to ensure idempotency. The same event may be sent multiple times due to retries."
              icon="🔄"
            />
            <BestPracticeCard
              title="Verify Signatures"
              description="Always verify the HMAC signature to ensure requests are authentically from Taxu and prevent spoofing."
              icon="🔒"
            />
            <BestPracticeCard
              title="Use HTTPS"
              description="Webhook endpoints must use HTTPS in production for secure transmission of sensitive data."
              icon="🛡️"
            />
            <BestPracticeCard
              title="Log Everything"
              description="Keep detailed logs of all webhook deliveries, responses, and errors for debugging and audit trails."
              icon="📝"
            />
          </div>
        </Card>

        {/* CTA Card */}
        <Card className="p-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl border-0">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
              <p className="text-blue-100 text-lg">
                Configure webhook endpoints and view delivery logs in the developer portal.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/developer-portal/webhooks">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-base px-6 py-6">
                  <Zap className="w-5 h-5 mr-2" />
                  Manage Webhooks
                </Button>
              </Link>
              <Link href="/developer/docs/api/overview">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-base px-6 py-6 bg-transparent"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View API Docs
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Helper Components
function EventCard({ event, description }: { event: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <code className="text-sm font-mono font-semibold text-blue-600">{event}</code>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
        <Button variant="ghost" size="sm" className="shrink-0" onClick={() => navigator.clipboard.writeText(event)}>
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function BestPracticeCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-5 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  )
}
