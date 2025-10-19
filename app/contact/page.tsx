"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit form")
      }

      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      console.error("[v0] Contact form error:", err)
      setError(err instanceof Error ? err.message : "Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartChat = () => {
    // Trigger the AI chat widget to open
    const chatButton = document.querySelector("[data-chat-widget-button]") as HTMLButtonElement
    if (chatButton) {
      chatButton.click()
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "support@taxu.ai",
      action: "Send Email",
      href: "mailto:support@taxu.ai",
      onClick: undefined,
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Available 9am-6pm EST",
      action: "Start Chat",
      href: undefined,
      onClick: handleStartChat,
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "1-800-TAXU-HELP",
      action: "Call Now",
      href: "tel:1-800-829-8435",
      onClick: undefined,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <MessageSquare className="h-4 w-4" />
            Contact Us
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            We're Here to
            <span className="text-accent"> Help</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Have questions about Taxu? Our team is ready to assist you with anything you need.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method) => (
              <Card key={method.title} className="p-6 text-center">
                <method.icon className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-muted-foreground mb-4">{method.description}</p>
                {method.href ? (
                  <a href={method.href}>
                    <Button variant="outline" className="w-full bg-transparent">
                      {method.action}
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent" onClick={method.onClick}>
                    {method.action}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for contacting us. We'll respond to your inquiry shortly.
                </p>
                <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">{error}</div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      <SelectItem value="press">Press Inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full glow-neon-strong" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* Office Location */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Visit Our Office</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Headquarters</div>
                    <div className="text-muted-foreground">
                      123 Innovation Drive
                      <br />
                      San Francisco, CA 94105
                      <br />
                      United States
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Phone</div>
                    <div className="text-muted-foreground">
                      1-800-TAXU-HELP
                      <br />
                      Mon-Fri: 9am-6pm EST
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <div className="text-muted-foreground">
                      support@taxu.ai
                      <br />
                      Response within 24 hours
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-4 h-96 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Map placeholder</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
