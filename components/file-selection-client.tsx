"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft, Building2, Users, Calendar } from "lucide-react"

export function FileSelectionClient() {
  const router = useRouter()

  const filingOptions = [
    {
      id: "w2",
      title: "File W-2",
      description: "Report employee wages and tax withholdings",
      icon: FileText,
      color: "text-green-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      details: [
        "Required for all employees",
        "Due by January 31st",
        "Reports wages, tips, and taxes withheld",
        "Automatically files with IRS and SSA",
      ],
    },
    {
      id: "1099-nec",
      title: "File 1099-NEC",
      description: "Report non-employee compensation to contractors",
      icon: Users,
      color: "text-blue-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      details: [
        "For independent contractors",
        "Due by January 31st",
        "Reports payments of $600 or more",
        "Bulk filing available",
      ],
    },
    {
      id: "941",
      title: "File Form 941",
      description: "Quarterly federal payroll tax return",
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      details: [
        "Required quarterly for employers",
        "Reports income taxes and FICA",
        "Due by end of month after quarter",
        "Includes tax deposits and adjustments",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Select Tax Form to File</h1>
          <p className="text-muted-foreground">Choose the form you need to file with the IRS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filingOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card
                key={option.id}
                className={`p-6 border ${option.borderColor} bg-gradient-to-br ${option.bgColor} backdrop-blur hover:scale-105 transition-all cursor-pointer`}
                onClick={() => router.push(`/dashboard/file/${option.id}`)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${option.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{option.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{option.description}</p>

                  <div className="flex-1 space-y-2 mb-4">
                    {option.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${option.color} mt-1.5 flex-shrink-0`} />
                        <span className="text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>

                  <Button className={`w-full ${option.color.replace("text-", "bg-")} hover:opacity-90 text-white`}>
                    Start Filing
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8 p-6 border-neon/20 bg-card/50 backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-neon" />
            </div>
            <div>
              <h3 className="font-bold mb-2">Need help choosing?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI agents can help you determine which forms you need to file based on your business structure and
                activities.
              </p>
              <Button onClick={() => router.push("/chat")} variant="outline" className="border-neon/20">
                Chat with Sam
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
