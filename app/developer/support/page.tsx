"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail, Book, Github, MessageSquare, HelpCircle, Zap, Users } from "lucide-react"

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I get started with the Taxu API?",
      answer:
        "Check out our Quick Start guide to create your first API integration in minutes. You'll need to sign up for a developer account and generate API keys.",
    },
    {
      question: "What are the rate limits for API requests?",
      answer:
        "Free tier: 100 requests/hour. Pro tier: 1,000 requests/hour. Enterprise: Custom limits. Rate limit headers are included in all API responses.",
    },
    {
      question: "How do I test my integration before going live?",
      answer:
        "Use our Sandbox environment with test API keys and sample data. All features work identically to production without affecting real user data.",
    },
    {
      question: "What happens if a webhook delivery fails?",
      answer:
        "We automatically retry failed webhooks with exponential backoff for up to 3 days. You can view delivery status and manually retry in the developer portal.",
    },
    {
      question: "How do I report a security vulnerability?",
      answer:
        "Email security@taxu.io with details. We take security seriously and respond to all reports within 24 hours.",
    },
  ]

  const resources = [
    {
      icon: Book,
      title: "Documentation",
      description: "Comprehensive guides and API reference",
      link: "/developer/docs/getting-started",
      color: "text-blue-400",
    },
    {
      icon: Zap,
      title: "API Playground",
      description: "Test API endpoints interactively",
      link: "/developer/playground",
      color: "text-purple-400",
    },
    {
      icon: MessageSquare,
      title: "Code Examples",
      description: "Real-world integration examples",
      link: "/developer/examples",
      color: "text-green-400",
    },
    {
      icon: Github,
      title: "GitHub",
      description: "SDKs, samples, and open source tools",
      link: "https://github.com/taxu",
      color: "text-gray-400",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">Support</Badge>
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-xl text-gray-400">Get support from our team and developer community</p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-[#111] border-gray-800 p-8 hover:border-purple-500/50 transition-colors cursor-pointer">
            <MessageCircle className="w-12 h-12 text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Live Chat</h2>
            <p className="text-gray-400 mb-4">
              Chat with our support team in real-time. Available Monday-Friday, 9am-6pm EST.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 w-full">Start Chat</Button>
          </Card>

          <Card className="bg-[#111] border-gray-800 p-8 hover:border-blue-500/50 transition-colors cursor-pointer">
            <Mail className="w-12 h-12 text-blue-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email Support</h2>
            <p className="text-gray-400 mb-4">
              Send us an email and we'll respond within 24 hours (usually much faster).
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full">Email Us</Button>
          </Card>
        </div>

        {/* Community */}
        <Card className="bg-[#111] border-gray-800 p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <Users className="w-8 h-8 text-green-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Developer Community</h2>
              <p className="text-gray-400">
                Join thousands of developers building with Taxu. Ask questions, share knowledge, and connect with other
                developers.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="border-gray-800 hover:border-purple-500 bg-transparent">
              <MessageSquare className="w-4 h-4 mr-2" />
              Join Discord
            </Button>
            <Button variant="outline" className="border-gray-800 hover:border-blue-500 bg-transparent">
              <Github className="w-4 h-4 mr-2" />
              GitHub Discussions
            </Button>
          </div>
        </Card>

        {/* Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Helpful Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <Card
                  key={resource.title}
                  className="bg-[#111] border-gray-800 p-6 hover:border-gray-700 transition-colors cursor-pointer"
                >
                  <Icon className={`w-8 h-8 ${resource.color} mb-3`} />
                  <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                  <p className="text-gray-400 text-sm">{resource.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ */}
        <Card className="bg-[#111] border-gray-800 p-8">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-red-500/10 border-red-500/20 p-8 mt-12">
          <h2 className="text-2xl font-bold mb-2 text-red-400">Critical Issues</h2>
          <p className="text-gray-300 mb-4">
            For production outages or critical security issues, contact our emergency support line:
          </p>
          <p className="text-xl font-mono text-white">+1 (555) 123-4567</p>
          <p className="text-sm text-gray-400 mt-2">Available 24/7 for Enterprise customers</p>
        </Card>
      </div>
    </div>
  )
}
