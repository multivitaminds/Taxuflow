import { MessageSquare, Mail, Book, Users, FileQuestion, Headphones } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const supportChannels = [
  {
    icon: MessageSquare,
    title: "Developer Forum",
    description: "Ask questions and get help from the community",
    action: "Visit Forum",
    href: "https://community.taxu.io",
    color: "text-blue-600",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help from our developer support team",
    action: "Email Us",
    href: "mailto:developers@taxu.io",
    color: "text-green-600",
  },
  {
    icon: Users,
    title: "Discord Community",
    description: "Chat with other developers in real-time",
    action: "Join Discord",
    href: "https://discord.gg/taxu",
    color: "text-purple-600",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description: "Get dedicated support for enterprise customers",
    action: "Contact Sales",
    href: "/contact",
    color: "text-orange-600",
  },
]

const faqs = [
  {
    question: "How do I get API keys?",
    answer:
      "Visit the Developer Dashboard to generate your API keys. You can create separate keys for testing and production.",
  },
  {
    question: "What are the API rate limits?",
    answer: "Free tier: 100 requests/minute. Pro tier: 1,000 requests/minute. Enterprise: Custom limits available.",
  },
  {
    question: "How do I test webhooks locally?",
    answer: "Use the Taxu CLI to forward webhook events to your local development server. Run: taxu webhooks listen",
  },
  {
    question: "Is there a sandbox environment?",
    answer: "Yes! Use api-sandbox.taxu.io for testing. All sandbox data is isolated and can be reset anytime.",
  },
  {
    question: "How do I report a bug?",
    answer:
      "Email developers@taxu.io with details about the issue, including API endpoint, request/response, and error messages.",
  },
]

export default function SupportPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">Developer Support</h1>
        <p className="text-xl text-muted-foreground">
          Get help building with Taxu. Our team and community are here to support you.
        </p>
      </div>

      {/* Support Channels */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Get Help</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {supportChannels.map((channel) => {
            const Icon = channel.icon
            return (
              <Card key={channel.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${channel.color}`} />
                    <div>
                      <CardTitle>{channel.title}</CardTitle>
                      <CardDescription>{channel.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link
                    href={channel.href}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {channel.action}
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>More ways to learn and get help</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/developer/docs" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <Book className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Documentation</h3>
              <p className="text-sm text-muted-foreground">Complete API reference and guides</p>
            </Link>
            <Link href="/developer/docs/guides" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <FileQuestion className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Guides</h3>
              <p className="text-sm text-muted-foreground">Step-by-step integration tutorials</p>
            </Link>
            <Link href="/developer/status" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <MessageSquare className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">API Status</h3>
              <p className="text-sm text-muted-foreground">Check system status and uptime</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
