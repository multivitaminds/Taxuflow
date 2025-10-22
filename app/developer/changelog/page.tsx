import { Calendar, Code2, Zap, Bug, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const releases = [
  {
    version: "v1.5.0",
    date: "January 20, 2025",
    type: "major",
    changes: [
      { type: "feature", icon: Zap, text: "Added real-time tax calculation API with support for all 50 states" },
      { type: "feature", icon: Code2, text: "New webhook events for document processing completion" },
      { type: "improvement", icon: Shield, text: "Enhanced API key security with automatic rotation" },
      { type: "fix", icon: Bug, text: "Fixed issue with W-2 data extraction for multi-employer scenarios" },
    ],
  },
  {
    version: "v1.4.2",
    date: "January 10, 2025",
    type: "minor",
    changes: [
      { type: "improvement", icon: Zap, text: "Improved API response times by 35%" },
      { type: "fix", icon: Bug, text: "Resolved webhook delivery retry logic issue" },
      { type: "fix", icon: Bug, text: "Fixed pagination bug in tax returns list endpoint" },
    ],
  },
  {
    version: "v1.4.0",
    date: "December 15, 2024",
    type: "major",
    changes: [
      { type: "feature", icon: Code2, text: "Launched Document Intelligence API for automated data extraction" },
      { type: "feature", icon: Zap, text: "Added support for 1099 forms (1099-NEC, 1099-MISC, 1099-INT)" },
      { type: "improvement", icon: Shield, text: "Enhanced rate limiting with per-endpoint controls" },
    ],
  },
  {
    version: "v1.3.1",
    date: "November 28, 2024",
    type: "patch",
    changes: [
      { type: "fix", icon: Bug, text: "Fixed authentication token expiration handling" },
      { type: "fix", icon: Bug, text: "Resolved CORS issue for sandbox environment" },
    ],
  },
]

const typeColors = {
  major: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  minor: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  patch: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
}

const changeTypeColors = {
  feature: "text-blue-600",
  improvement: "text-green-600",
  fix: "text-orange-600",
}

export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">Changelog</h1>
        <p className="text-xl text-muted-foreground">
          Stay up to date with the latest API updates, new features, and improvements.
        </p>
      </div>

      {/* Subscribe */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribe to Updates</CardTitle>
          <CardDescription>Get notified when we release new features and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2 border rounded-md" />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Releases */}
      <div className="space-y-6">
        {releases.map((release) => (
          <Card key={release.version}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle>{release.version}</CardTitle>
                    <CardDescription>{release.date}</CardDescription>
                  </div>
                </div>
                <Badge className={typeColors[release.type as keyof typeof typeColors]}>{release.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {release.changes.map((change, index) => {
                  const Icon = change.icon
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <Icon
                        className={`h-5 w-5 mt-0.5 ${changeTypeColors[change.type as keyof typeof changeTypeColors]}`}
                      />
                      <span className="text-sm">{change.text}</span>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
