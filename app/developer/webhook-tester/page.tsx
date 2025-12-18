"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Copy, Check, RefreshCw, AlertCircle, CheckCircle2, Terminal, Zap } from "lucide-react"

export default function WebhookTesterPage() {
  const [url, setUrl] = useState("https://your-app.com/webhook")
  const [secret, setSecret] = useState("")
  const [selectedEvent, setSelectedEvent] = useState("document.processed")
  const [customPayload, setCustomPayload] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)

  const eventTypes = [
    {
      type: "document.processed",
      description: "Triggered when a document has been successfully processed",
      payload: {
        id: "evt_1234567890",
        type: "document.processed",
        created: Date.now(),
        data: {
          object: {
            id: "doc_abc123",
            type: "w2",
            status: "processed",
            year: 2024,
            extractedData: {
              employerName: "Acme Corp",
              ein: "12-3456789",
              wages: 75000,
              federalTaxWithheld: 8500,
            },
          },
        },
      },
    },
    {
      type: "filing.submitted",
      description: "Triggered when a tax return has been submitted",
      payload: {
        id: "evt_0987654321",
        type: "filing.submitted",
        created: Date.now(),
        data: {
          object: {
            id: "filing_xyz789",
            status: "submitted",
            form: "1040",
            year: 2024,
            submittedAt: new Date().toISOString(),
          },
        },
      },
    },
    {
      type: "payment.succeeded",
      description: "Triggered when a payment has been successfully processed",
      payload: {
        id: "evt_1122334455",
        type: "payment.succeeded",
        created: Date.now(),
        data: {
          object: {
            id: "pay_def456",
            amount: 9900,
            currency: "usd",
            status: "succeeded",
            description: "Tax filing service",
          },
        },
      },
    },
    {
      type: "refund.calculated",
      description: "Triggered when a refund calculation is complete",
      payload: {
        id: "evt_5566778899",
        type: "refund.calculated",
        created: Date.now(),
        data: {
          object: {
            id: "calc_ghi789",
            estimatedRefund: 2450,
            federalRefund: 1800,
            stateRefund: 650,
            confidence: 0.95,
          },
        },
      },
    },
  ]

  const handleTest = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      const event = eventTypes.find((e) => e.type === selectedEvent)
      const payload = customPayload || JSON.stringify(event?.payload, null, 2)

      // Simulate HMAC signature generation
      const timestamp = Date.now()
      const signedPayload = `${timestamp}.${payload}`

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setResponse(
        JSON.stringify(
          {
            status: "delivered",
            statusCode: 200,
            responseTime: "142ms",
            signature: `sha256=${Math.random().toString(36).substring(2, 15)}...`,
            timestamp: new Date().toISOString(),
            payload: JSON.parse(payload),
          },
          null,
          2,
        ),
      )
      setTestResult("success")
    } catch (error) {
      setResponse(
        JSON.stringify(
          {
            status: "failed",
            error: "Connection timeout",
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
      )
      setTestResult("error")
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateSignature = () => {
    const event = eventTypes.find((e) => e.type === selectedEvent)
    const payload = JSON.stringify(event?.payload)
    return `sha256=${Math.random().toString(36).substring(2, 15)}abcdef1234567890`
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Developer Tools
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Webhook Tester</h1>
          <p className="text-xl text-slate-400">
            Test webhook delivery to your endpoint with sample events and verify signature validation
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-sm text-slate-400">Event Types</div>
              </div>
            </div>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-slate-400">Delivery Rate</div>
              </div>
            </div>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{"<1s"}</div>
                <div className="text-sm text-slate-400">Avg Response</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Configuration
              </h2>

              {/* Webhook URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Webhook Endpoint URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-app.com/webhook"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-2">The endpoint where webhooks will be delivered</p>
              </div>

              {/* Webhook Secret */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Webhook Signing Secret</label>
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="whsec_..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-2">Used to verify webhook signatures (optional for testing)</p>
              </div>

              {/* Event Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Event Type</label>
                <div className="space-y-2">
                  {eventTypes.map((event) => (
                    <button
                      key={event.type}
                      onClick={() => {
                        setSelectedEvent(event.type)
                        setCustomPayload("")
                      }}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedEvent === event.type
                          ? "bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/20"
                          : "bg-slate-950 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-sm font-mono text-blue-400">{event.type}</code>
                        {selectedEvent === event.type && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-xs text-slate-400">{event.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Payload */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">Custom Payload (Optional)</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCustomPayload("")}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
                <textarea
                  value={
                    customPayload || JSON.stringify(eventTypes.find((e) => e.type === selectedEvent)?.payload, null, 2)
                  }
                  onChange={(e) => setCustomPayload(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 font-mono text-xs h-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={handleTest}
                disabled={loading || !url}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20"
              >
                <Play className="w-4 h-4 mr-2" />
                {loading ? "Sending..." : "Send Test Webhook"}
              </Button>
            </Card>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Response
                </h2>
                {response && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(response)}
                    className="text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>

              {testResult && (
                <div
                  className={`mb-4 p-4 rounded-lg border ${testResult === "success" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
                >
                  <div className="flex items-center gap-2">
                    {testResult === "success" ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="font-medium text-green-400">Webhook delivered successfully</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="font-medium text-red-400">Webhook delivery failed</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {response ? (
                <div>
                  <pre className="bg-slate-950 rounded-lg p-4 text-slate-300 font-mono text-xs overflow-x-auto max-h-[600px] border border-slate-700">
                    {response}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <Terminal className="w-12 h-12 mb-3 opacity-30" />
                  <p>Send a test webhook to see the response</p>
                </div>
              )}
            </Card>

            {/* Signature Verification Helper */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Signature Verification</h3>
              <p className="text-sm text-slate-400 mb-4">
                Webhooks are signed with HMAC SHA-256. Verify the signature to ensure the webhook is from Taxu.
              </p>

              <Tabs defaultValue="nodejs" className="w-full">
                <TabsList className="bg-slate-950">
                  <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="nodejs">
                  <pre className="bg-slate-950 rounded-lg p-4 text-green-400 font-mono text-xs overflow-x-auto border border-slate-700">
                    {`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hmac)
  );
}`}
                  </pre>
                </TabsContent>
                <TabsContent value="python">
                  <pre className="bg-slate-950 rounded-lg p-4 text-blue-400 font-mono text-xs overflow-x-auto border border-slate-700">
                    {`import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    computed_sig = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(
        signature,
        computed_sig
    )`}
                  </pre>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
