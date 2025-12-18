"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  Home,
  Plane,
  GraduationCap,
  Car,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

export function GoalsClient() {
  const totalSaved = 45230
  const totalGoals = 125000
  const percentComplete = (totalSaved / totalGoals) * 100

  const goals = [
    {
      id: 1,
      name: "Emergency Fund",
      icon: Heart,
      target: 25000,
      saved: 18500,
      monthly: 500,
      deadline: "Dec 2025",
      color: "red",
      priority: "high",
      onTrack: true,
    },
    {
      id: 2,
      name: "Down Payment",
      icon: Home,
      target: 60000,
      saved: 22400,
      monthly: 1200,
      deadline: "Jun 2026",
      color: "blue",
      priority: "high",
      onTrack: true,
    },
    {
      id: 3,
      name: "Vacation",
      icon: Plane,
      target: 8000,
      saved: 3200,
      monthly: 400,
      deadline: "Aug 2025",
      color: "purple",
      priority: "medium",
      onTrack: false,
    },
    {
      id: 4,
      name: "New Car",
      icon: Car,
      target: 25000,
      saved: 1130,
      monthly: 300,
      deadline: "Dec 2027",
      color: "emerald",
      priority: "medium",
      onTrack: true,
    },
    {
      id: 5,
      name: "Education",
      icon: GraduationCap,
      target: 7000,
      saved: 0,
      monthly: 200,
      deadline: "Jan 2026",
      color: "orange",
      priority: "low",
      onTrack: true,
    },
  ]

  const recommendations = [
    {
      title: "Increase Vacation Savings",
      description: "You're behind schedule. Consider adding $150/month to reach your goal on time.",
      impact: "high",
      icon: Sparkles,
    },
    {
      title: "Automate Emergency Fund",
      description: "Set up automatic transfers to never miss a contribution.",
      impact: "medium",
      icon: Target,
    },
  ]

  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType)
    console.log("[v0] Clicked goal card:", cardType)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2540]">Financial Goals</h1>
          <p className="text-slate-600">Track progress toward your savings goals</p>
        </div>
        <Link href="/neobank/goals/new">
          <Button className="bg-[#635bff] hover:bg-[#5146e5] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card
          className="hover:shadow-lg transition-shadow border-l-4 border-l-[#635bff] cursor-pointer"
          onClick={() => handleCardClick("total-saved")}
        >
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Total Saved</CardDescription>
            <CardTitle className="text-2xl">${totalSaved.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.round(percentComplete)}% of total goals
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500 cursor-pointer"
          onClick={() => handleCardClick("target")}
        >
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Target Amount</CardDescription>
            <CardTitle className="text-2xl">${totalGoals.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-slate-600">
              <Target className="h-3 w-3 mr-1" />
              Across {goals.length} goals
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500 cursor-pointer"
          onClick={() => handleCardClick("on-track")}
        >
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">On Track</CardDescription>
            <CardTitle className="text-2xl">{goals.filter((g) => g.onTrack).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-emerald-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {goals.length - goals.filter((g) => g.onTrack).length} need attention
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-[#635bff] to-[#5146e5] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Overall Progress</h3>
              <p className="text-white/80 text-sm">Keep up the great work!</p>
            </div>
            <div className="text-3xl font-bold">{Math.round(percentComplete)}%</div>
          </div>
          <Progress value={percentComplete} className="h-3 bg-white/20" indicatorClassName="bg-white" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#0a2540]">Your Goals</h2>
        {goals.map((goal) => {
          const percentComplete = (goal.saved / goal.target) * 100
          const remaining = goal.target - goal.saved
          const Icon = goal.icon
          const monthsToDeadline = 12

          return (
            <Card
              key={goal.id}
              className="hover:shadow-lg transition-all cursor-pointer group border-l-4"
              style={{ borderLeftColor: goal.onTrack ? "#10b981" : "#f59e0b" }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-${goal.color}-100`}>
                      <Icon className={`h-6 w-6 text-${goal.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0a2540] text-lg">{goal.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          ${goal.monthly}/month
                        </Badge>
                        <Badge variant={goal.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                          {goal.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#0a2540]">${goal.saved.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">of ${goal.target.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      {goal.deadline}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">${remaining.toLocaleString()} remaining</span>
                    <span className="font-medium text-slate-900">{Math.round(percentComplete)}%</span>
                  </div>
                  <Progress
                    value={percentComplete}
                    className="h-2"
                    indicatorClassName={goal.onTrack ? "bg-emerald-500" : "bg-orange-500"}
                  />
                </div>

                {!goal.onTrack && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-900">
                      <span className="font-medium">Behind schedule.</span> Consider increasing monthly contribution to
                      ${Math.ceil(remaining / monthsToDeadline)}/month
                    </p>
                  </div>
                )}

                <Link href={`/neobank/goals/${goal.id}`}>
                  <Button variant="ghost" className="w-full mt-4 group-hover:bg-slate-100">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#0a2540]">AI Recommendations</h2>
        {recommendations.map((rec, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <rec.icon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[#0a2540]">{rec.title}</h3>
                  <Badge variant={rec.impact === "high" ? "destructive" : "secondary"}>{rec.impact} impact</Badge>
                </div>
                <p className="text-sm text-slate-600">{rec.description}</p>
                <Button variant="ghost" size="sm" className="mt-3">
                  Apply Recommendation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
