"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  TrendingUp,
  Shield,
  Calendar,
  MessageSquare,
  Settings,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { DocumentUpload } from "@/components/document-upload"

interface DashboardClientProps {
  user: User
  profile: {
    full_name: string | null
    preferred_agent: string
    subscription_tier: string
  } | null
}

export function DashboardClient({ user, profile }: DashboardClientProps) {
  const [selectedAgent, setSelectedAgent] = useState(profile?.preferred_agent || "Sophie")
  const userName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there"

  const agents = [
    { name: "Sophie", role: "Filing Assistant", color: "from-cyan-500 to-blue-500" },
    { name: "Jordan", role: "Tax Coach", color: "from-purple-500 to-pink-500" },
    { name: "Kai", role: "Audit Advisor", color: "from-orange-500 to-red-500" },
    { name: "Riley", role: "Business Planner", color: "from-green-500 to-emerald-500" },
    { name: "Leo", role: "Refund Analyst", color: "from-yellow-500 to-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}</h1>
          <p className="text-muted-foreground">Your 2024 tax filing is 75% complete</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-neon" />
              <span className="text-xs text-muted-foreground">Estimated</span>
            </div>
            <div className="text-2xl font-bold text-neon">$3,247</div>
            <div className="text-sm text-muted-foreground">Expected Refund</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-xs text-muted-foreground">Audit Risk</span>
            </div>
            <div className="text-2xl font-bold text-green-500">Low</div>
            <div className="text-sm text-muted-foreground">96% Confidence</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-muted-foreground">Documents</span>
            </div>
            <div className="text-2xl font-bold">8/10</div>
            <div className="text-sm text-muted-foreground">Uploaded</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-muted-foreground">Deadline</span>
            </div>
            <div className="text-2xl font-bold">42</div>
            <div className="text-sm text-muted-foreground">Days Left</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Current Task */}
                <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
                  <h2 className="text-xl font-bold mb-4">Continue Filing</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-neon" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Personal Information</h3>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-neon" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Income Documents</h3>
                        <p className="text-sm text-muted-foreground">W-2 and 1099 uploaded</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-neon flex items-center justify-center flex-shrink-0 animate-pulse">
                        <AlertCircle className="w-5 h-5 text-background" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Deductions & Credits</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Sophie found 3 potential deductions for you
                        </p>
                        <Button className="bg-neon hover:bg-neon/90 text-background">Review Now</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <DocumentUpload />
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                {/* Recent Activity */}
                <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-2 h-2 rounded-full bg-neon" />
                      <span className="text-muted-foreground">2 hours ago</span>
                      <span>Sophie analyzed your W-2 from Acme Corp</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Yesterday</span>
                      <span>Leo increased your refund estimate by $247</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">2 days ago</span>
                      <span>Kai verified your audit risk score: Low</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your AI Team */}
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">Your AI Team</h2>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <button
                    key={agent.name}
                    onClick={() => setSelectedAgent(agent.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedAgent === agent.name
                        ? "bg-neon/10 border border-neon/20"
                        : "bg-background/50 hover:bg-background/80"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold`}
                    >
                      {agent.name[0]}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">{agent.role}</div>
                    </div>
                  </button>
                ))}
              </div>
              <Button className="w-full mt-4 bg-neon hover:bg-neon/90 text-background">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with {selectedAgent}
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-neon/20 bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Review
                </Button>
                <Button variant="outline" className="w-full justify-start border-neon/20 bg-transparent">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
                <Button variant="outline" className="w-full justify-start border-neon/20 bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </Card>

            {/* Upgrade Prompt */}
            {profile?.subscription_tier === "Free" && (
              <Card className="p-6 border-neon/20 bg-gradient-to-br from-neon/10 to-blue-500/10">
                <h3 className="font-bold mb-2">Unlock AI Co-Pilot</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get year-round tax advice, reminders, and planning for just $5/month
                </p>
                <Button className="w-full bg-neon hover:bg-neon/90 text-background">Upgrade Now</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
