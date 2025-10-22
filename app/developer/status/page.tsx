import { CheckCircle2, AlertCircle, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const services = [
  { name: "Tax Filing API", status: "operational", uptime: "99.99%", latency: "45ms" },
  { name: "Document Intelligence API", status: "operational", uptime: "99.98%", latency: "120ms" },
  { name: "Tax Calculation API", status: "operational", uptime: "99.99%", latency: "32ms" },
  { name: "Accounting API", status: "operational", uptime: "99.97%", latency: "58ms" },
  { name: "Webhook Delivery", status: "operational", uptime: "99.96%", latency: "89ms" },
  { name: "Authentication Service", status: "operational", uptime: "100%", latency: "12ms" },
]

const incidents = [
  {
    date: "Jan 15, 2025",
    title: "Increased API Latency",
    status: "resolved",
    duration: "23 minutes",
    description: "Brief increase in API response times due to database optimization.",
  },
  {
    date: "Dec 28, 2024",
    title: "Webhook Delivery Delays",
    status: "resolved",
    duration: "1 hour 12 minutes",
    description: "Webhook events experienced delivery delays. All events were successfully delivered.",
  },
]

export default function StatusPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">API Status</h1>
        <p className="text-xl text-muted-foreground">Real-time status and uptime monitoring for all Taxu services.</p>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Systems Operational</CardTitle>
              <CardDescription>Last updated: {new Date().toLocaleString()}</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Operational
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Service Status */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Service Status</h2>
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-muted-foreground">Uptime</p>
                      <p className="font-semibold">{service.uptime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Latency</p>
                      <p className="font-semibold">{service.latency}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Uptime Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">30-Day Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">99.98%</span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">62ms</span>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incidents (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">2</span>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Card key={incident.date}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{incident.title}</CardTitle>
                    <CardDescription>
                      {incident.date} • {incident.duration}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Resolved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{incident.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
