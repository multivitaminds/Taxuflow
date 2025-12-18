"use client"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export function StatusClient() {
  const services = [
    { name: "API Gateway", status: "operational", uptime: "99.99%" },
    { name: "Document Processing", status: "operational", uptime: "99.98%" },
    { name: "Tax Calculations", status: "operational", uptime: "99.99%" },
    { name: "Database", status: "operational", uptime: "100%" },
    { name: "Webhooks", status: "operational", uptime: "99.97%" },
    { name: "Authentication", status: "operational", uptime: "100%" },
  ]

  const incidents = [
    {
      title: "Increased API Latency",
      date: "November 28, 2024",
      status: "resolved",
      description:
        "We experienced elevated response times for approximately 15 minutes. The issue was resolved by scaling our infrastructure.",
    },
    {
      title: "Scheduled Maintenance",
      date: "November 15, 2024",
      status: "completed",
      description: "Routine database maintenance completed successfully with no service interruption.",
    },
  ]

  const uptimeData = [
    { date: "Jan 9", uptime: 100 },
    { date: "Jan 10", uptime: 99.98 },
    { date: "Jan 11", uptime: 100 },
    { date: "Jan 12", uptime: 99.99 },
    { date: "Jan 13", uptime: 100 },
    { date: "Jan 14", uptime: 100 },
    { date: "Today", uptime: 99.99 },
  ]

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <Link
        href="/developer-portal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Developer Portal
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-accent/30 bg-card p-8 mb-8 glow-neon">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
          <h1 className="text-4xl font-bold">All Systems Operational</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-6">All services are running smoothly</p>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">API Uptime</p>
            <p className="text-2xl font-bold">99.99%</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Last Incident</p>
            <p className="text-2xl font-bold">47 days ago</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Avg Response Time</p>
            <p className="text-2xl font-bold">48ms</p>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Service Status</h2>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-background"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{service.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="font-semibold">{service.uptime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uptime History */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">7-Day Uptime History</h2>
        <div className="flex items-end gap-2 h-32">
          {uptimeData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={`w-full rounded-t transition-all ${
                  day.uptime === 100 ? "bg-green-500" : day.uptime >= 99.9 ? "bg-green-400" : "bg-amber-500"
                }`}
                style={{ height: `${day.uptime}%` }}
              ></div>
              <p className="text-xs text-muted-foreground">{day.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Incident History */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Incidents</h2>
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <div key={index} className="p-6 rounded-xl border border-border bg-background">
              <div className="flex items-start gap-4 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{incident.title}</h3>
                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium capitalize">
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{incident.date}</p>
                  <p className="text-sm">{incident.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
