"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from "lucide-react"

export default function StatusPage() {
  const services = [
    { name: "API Gateway", status: "operational", uptime: "99.99%" },
    { name: "Document Processing", status: "operational", uptime: "99.97%" },
    { name: "Tax Calculation Engine", status: "operational", uptime: "99.98%" },
    { name: "AI Agents", status: "operational", uptime: "99.95%" },
    { name: "Webhooks", status: "operational", uptime: "99.96%" },
    { name: "Authentication", status: "operational", uptime: "100%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
    { name: "File Storage", status: "operational", uptime: "99.98%" },
  ]

  const incidents = [
    {
      date: "January 10, 2025",
      title: "Increased API Latency",
      status: "resolved",
      duration: "23 minutes",
      description:
        "Brief increase in API response times due to database connection pool exhaustion. Resolved by scaling connection pools.",
    },
    {
      date: "December 15, 2024",
      title: "Webhook Delivery Delays",
      status: "resolved",
      duration: "1 hour 12 minutes",
      description:
        "Webhook deliveries experienced delays due to queue processing issues. All delayed webhooks were successfully delivered.",
    },
  ]

  const metrics = [
    { label: "API Response Time", value: "142ms", trend: "down", change: "-12%" },
    { label: "Success Rate", value: "99.97%", trend: "up", change: "+0.02%" },
    { label: "Uptime (30 days)", value: "99.98%", trend: "stable", change: "0%" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">All Systems Operational</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">System Status</h1>
          <p className="text-xl text-muted-foreground">Real-time status and performance metrics for Taxu API</p>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric) => (
            <Card key={metric.label} className="bg-card border-border p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <TrendingUp
                  className={`w-4 h-4 ${
                    metric.trend === "up"
                      ? "text-green-500"
                      : metric.trend === "down"
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}
                />
              </div>
              <p className="text-3xl font-bold mb-1 text-foreground">{metric.value}</p>
              <p
                className={`text-sm ${
                  metric.trend === "up"
                    ? "text-green-600"
                    : metric.trend === "down"
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {metric.change} from last month
              </p>
            </Card>
          ))}
        </div>

        {/* Services Status */}
        <Card className="bg-card border-border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Service Status</h2>
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-foreground">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{service.uptime} uptime</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Operational</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Incident History */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Recent Incidents</h2>

          {incidents.length > 0 ? (
            <div className="space-y-6">
              {incidents.map((incident, idx) => (
                <div key={idx} className="border-l-2 border-border pl-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{incident.date}</p>
                      <h3 className="font-semibold text-lg text-foreground">{incident.title}</h3>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Resolved</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {incident.duration}</span>
                  </div>
                  <p className="text-muted-foreground">{incident.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-muted-foreground">No incidents in the last 90 days</p>
            </div>
          )}
        </Card>

        {/* Subscribe to Updates */}
        <Card className="bg-card border-border p-8 mt-12 text-center">
          <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Get Status Updates</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to receive notifications about incidents and maintenance
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
            <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
