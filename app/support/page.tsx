import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Mail, Book, Video, FileText, HeadphonesIcon, Clock, Phone, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Support - Taxu",
  description: "Get help with Taxu. Access documentation, contact support, and find answers to common questions.",
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">How can we help you?</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get the support you need to make the most of Taxu. Our team is here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-2xl font-bold">Contact Support</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <MessageCircle className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Chat with our support team in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">Available Monday - Friday, 9am - 6pm EST</p>
                <Button className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <Mail className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Send us an email and we'll respond within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">support@taxu.com</p>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="mailto:support@taxu.com">
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <Phone className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Phone Support</CardTitle>
                <CardDescription>Speak directly with our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">1-800-TAXU-HELP (8298-4357)</p>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="tel:1-800-829-8435">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Self-Service Resources */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-2xl font-bold">Self-Service Resources</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Book className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Comprehensive guides and API references</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/docs" className="block text-sm text-primary hover:underline">
                  → Browse Documentation
                </Link>
                <Link href="/developer/docs" className="block text-sm text-primary hover:underline">
                  → Developer Docs
                </Link>
                <Link href="/api-docs" className="block text-sm text-primary hover:underline">
                  → API Reference
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Guides & Tutorials</CardTitle>
                <CardDescription>Step-by-step guides to help you get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/guides" className="block text-sm text-primary hover:underline">
                  → View All Guides
                </Link>
                <Link href="/developer/docs/getting-started" className="block text-sm text-primary hover:underline">
                  → Getting Started
                </Link>
                <Link href="/developer/quickstart" className="block text-sm text-primary hover:underline">
                  → Quick Start Tutorial
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Video className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Watch video guides and walkthroughs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Coming soon - Video tutorials covering key features and workflows
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <HeadphonesIcon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Community Forum</CardTitle>
                <CardDescription>Connect with other Taxu users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Join our community to ask questions, share tips, and learn from others
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  Visit Forum
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I get started with Taxu?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sign up for a free account, connect your banking or accounting software, and start filing taxes or
                  managing your books. Check out our{" "}
                  <Link href="/developer/docs/getting-started" className="text-primary hover:underline">
                    Getting Started guide
                  </Link>{" "}
                  for detailed instructions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What forms does Taxu support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Taxu supports 1099-NEC, 1099-MISC, W-2, 941, 940, and many other federal tax forms. Visit our{" "}
                  <Link href="/tax-filing" className="text-primary hover:underline">
                    Tax Filing page
                  </Link>{" "}
                  to see the full list.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I integrate Taxu with my app?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Taxu offers RESTful APIs and SDKs in multiple languages. Check out our{" "}
                  <Link href="/developer" className="text-primary hover:underline">
                    Developer Portal
                  </Link>{" "}
                  and{" "}
                  <Link href="/api-docs" className="text-primary hover:underline">
                    API Documentation
                  </Link>{" "}
                  to get started.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure with Taxu?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes. Taxu uses bank-level encryption, is SOC 2 Type II certified, and follows industry best practices
                  for data security. Learn more on our{" "}
                  <Link href="/security" className="text-primary hover:underline">
                    Security page
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What are your support hours?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Live Chat & Phone: Monday - Friday, 9am - 6pm EST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email: 24/7 (responses within 24 hours)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How much does Taxu cost?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Taxu offers flexible pricing based on your needs. Check out our{" "}
                  <Link href="/pricing" className="text-primary hover:underline">
                    Pricing page
                  </Link>{" "}
                  for detailed information on plans and features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Support CTA */}
      <section className="border-t bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Need Enterprise Support?</h2>
          <p className="mb-8 text-muted-foreground">
            Get dedicated account management, priority support, and custom SLAs for your business.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
