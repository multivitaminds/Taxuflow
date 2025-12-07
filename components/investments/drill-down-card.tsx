"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DrillDownCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: LucideIcon
  subtitle?: string
  drillDownPath: string
}

export function DrillDownCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  subtitle,
  drillDownPath,
}: DrillDownCardProps) {
  return (
    <Card className="border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              changeType === "positive" && "text-emerald-600",
              changeType === "negative" && "text-red-600",
              changeType === "neutral" && "text-muted-foreground",
            )}
          >
            {changeType === "positive" && <ArrowUpIcon className="w-4 h-4" />}
            {changeType === "negative" && <ArrowDownIcon className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
