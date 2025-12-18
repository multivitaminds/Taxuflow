import Link from "next/link"
import { ArrowRight, Zap, Shield, Clock, CheckCircle2, Terminal, BookOpen, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Webhooks - Taxu Developer Platform",
  description: "Receive real-time notifications for events in your Taxu integration",
}

export default function WebhooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              Real-Time Event Notifications
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Taxu Webhooks</h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Stay in sync with events in your Taxu integration. Receive real-time notifications for tax filings,
              payments, bank transactions, and document processing.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/developer/docs/webhooks">
                <Button size="lg" variant="secondary" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Read Documentation
                </Button>
              </Link>
              <Link href="/developer-portal/webhooks">
                <Button size="lg" className="gap-2 bg-white text-indigo-600 hover:bg-blue-50">
                  <Settings className="h-4 w-4" />
                  Manage Endpoints
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why Use Webhooks?</h2>
          <p className="mt-4 text-lg text-slate-600">Build reactive integrations that respond to events in real-time</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-indigo-300 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Available Events</h2>
            <p className="mt-4 text-lg text-slate-600">
              Subscribe to 14 different event types across your Taxu integration
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {eventCategories.map((category) => (
              <div key={category.name} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${category.color}`} />
                  <h3 className="font-semibold text-slate-900">{category.name}</h3>
                </div>
                <ul className="space-y-2">
                  {category.events.map((event) => (
                    <li key={event} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <code className="text-xs">{event}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">How It Works</h2>
          <p className="mt-4 text-lg text-slate-600">Set up webhooks in minutes and start receiving events</p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-slate-600">{step.description}</p>
                  {step.code && (
                    <div className="mt-4 rounded-lg bg-slate-900 p-4">
                      <code className="text-sm text-emerald-400">{step.code}</code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Create your first webhook endpoint and start receiving real-time events
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/developer-portal/webhooks">
                <Button size="lg" className="gap-2 bg-white text-indigo-600 hover:bg-blue-50">
                  Create Webhook Endpoint
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/developer/docs/webhooks">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Terminal className="h-4 w-4" />
                  View CLI Examples
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    name: "Real-Time Updates",
    description: "Receive instant notifications when events occur in your Taxu account. No polling required.",
    icon: Zap,
  },
  {
    name: "Secure Delivery",
    description: "Every webhook includes an HMAC signature for verification, ensuring authenticity.",
    icon: Shield,
  },
  {
    name: "Automatic Retries",
    description: "Failed deliveries are automatically retried with exponential backoff up to 3 times.",
    icon: Clock,
  },
]

const eventCategories = [
  {
    name: "Tax Filing",
    color: "bg-blue-500",
    events: [
      "tax.filing.created",
      "tax.filing.submitted",
      "tax.filing.accepted",
      "tax.filing.rejected",
      "tax.filing.amended",
    ],
  },
  {
    name: "Payments",
    color: "bg-emerald-500",
    events: ["payment.succeeded", "payment.failed", "payment.refunded"],
  },
  {
    name: "Banking",
    color: "bg-purple-500",
    events: ["transaction.posted", "account.updated", "transfer.completed"],
  },
  {
    name: "Documents",
    color: "bg-amber-500",
    events: ["document.uploaded", "document.processed", "document.verified"],
  },
]

const steps = [
  {
    title: "Configure Endpoint",
    description: "Add your webhook URL and select which events you want to receive in the developer portal.",
    code: "https://your-app.com/api/webhooks/taxu",
  },
  {
    title: "Verify Signature",
    description: "Use your signing secret to verify that webhook requests are coming from Taxu.",
    code: null,
  },
  {
    title: "Handle Events",
    description: "Process webhook events in your application and respond with a 200 status code.",
    code: null,
  },
]
