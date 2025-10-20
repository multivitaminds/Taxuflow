"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TaxOptimization } from "@/lib/tax/optimization-engine"
import {
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react"

interface TaxOptimizerClientProps {
  optimizations: TaxOptimization[]
}

export function TaxOptimizerClient({ optimizations }: TaxOptimizerClientProps) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())

  const totalSavings = optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0)

  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedCards(newExpanded)
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-900">AI Tax Optimizer</h1>
        </div>
        <p className="text-lg text-gray-600">Personalized strategies to maximize your tax savings</p>
      </div>

      {/* Total Savings Card */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">Potential Total Savings</p>
            <p className="text-5xl font-bold">${totalSavings.toLocaleString()}</p>
            <p className="text-sm opacity-90 mt-2">{optimizations.length} optimization strategies identified</p>
          </div>
          <TrendingUp className="h-20 w-20 opacity-50" />
        </div>
      </Card>

      {/* Optimizations List */}
      <div className="space-y-4">
        {optimizations.map((optimization, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => toggleCard(index)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{optimization.title}</h3>
                  <Badge className={getConfidenceColor(optimization.confidence)}>
                    {optimization.confidence} confidence
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">{optimization.category}</p>
                <p className="text-gray-700">{optimization.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
                  <DollarSign className="h-5 w-5" />
                  {optimization.potentialSavings.toLocaleString()}
                </div>
                {expandedCards.has(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {optimization.deadline && (
              <div className="flex items-center gap-2 text-sm text-orange-600 mb-4">
                <Calendar className="h-4 w-4" />
                <span>Deadline: {optimization.deadline}</span>
              </div>
            )}

            {expandedCards.has(index) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Action Items
                </h4>
                <ul className="space-y-2">
                  {optimization.actionItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-gray-700">
                      <span className="text-purple-600 font-bold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">Start This Optimization</Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-700 mb-3">
              Our AI tax team is here to help you implement these strategies. Chat with Sam, your Lead Tax Strategist,
              for personalized guidance.
            </p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100 bg-transparent">
              Chat with Sam
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
