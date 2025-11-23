"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AIAgentsAPIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">AI Agents API</h1>
        <p className="text-lg text-muted-foreground">
          Leverage Taxu's AI agents for intelligent tax insights, optimization strategies, and predictive analytics.
        </p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="default">POST</Badge>
          <code className="text-lg">/v1/ai/insights</code>
        </div>
        <p className="text-muted-foreground mb-6">
          Generate intelligent tax insights from your data using AI analysis.
        </p>

        <h3 className="font-semibold mb-3">Example Request</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
          <code>{String.raw`curl https://api.taxu.io/v1/ai/insights \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "income": 75000,
      "deductions": 5000,
      "tax_year": 2024
    }
  }'`}</code>
        </pre>

        <h3 className="font-semibold mb-3">Response</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`{
  "insights": [
    {
      "type": "opportunity",
      "title": "Retirement Contribution Opportunity",
      "description": "You could reduce your tax liability by $1,650 by maximizing your 401(k) contributions",
      "potential_savings": 1650.00,
      "confidence": 92
    },
    {
      "type": "warning",
      "title": "Estimated Tax Payment Due",
      "description": "Based on your income, you may need to make quarterly estimated tax payments",
      "confidence": 88
    }
  ]
}`}</code>
        </pre>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="default">POST</Badge>
          <code className="text-lg">/v1/ai/optimize</code>
        </div>
        <p className="text-muted-foreground mb-6">
          Find tax optimization strategies tailored to your financial situation.
        </p>

        <h3 className="font-semibold mb-3">Example Request</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
          <code>{String.raw`curl https://api.taxu.io/v1/ai/optimize \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "income": 75000,
    "federal_withheld": 12000,
    "filing_status": "single"
  }'`}</code>
        </pre>

        <h3 className="font-semibold mb-3">Response</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`{
  "strategies": [
    {
      "category": "retirement",
      "title": "Maximize 401(k) Contributions",
      "description": "Increase contributions to reduce taxable income",
      "potential_savings": 1650.00,
      "implementation_difficulty": "easy"
    },
    {
      "category": "health",
      "title": "Open Health Savings Account",
      "description": "HSA contributions are tax-deductible",
      "potential_savings": 847.00,
      "implementation_difficulty": "medium"
    }
  ]
}`}</code>
        </pre>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="default">POST</Badge>
          <code className="text-lg">/v1/ai/predict</code>
        </div>
        <p className="text-muted-foreground mb-6">
          Predict future tax refunds based on historical data and current trends.
        </p>

        <h3 className="font-semibold mb-3">Example Request</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
          <code>{String.raw`curl https://api.taxu.io/v1/ai/predict \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "current_income": 75000,
    "current_withholding": 12000,
    "historical_data": [
      {
        "year": 2023,
        "income": 70000,
        "refund": 2500
      }
    ]
  }'`}</code>
        </pre>

        <h3 className="font-semibold mb-3">Response</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`{
  "predicted_refund": 3200.00,
  "confidence": 87,
  "factors": [
    "Income increased by 7% from previous year",
    "Withholding rate is optimal",
    "Historical refund pattern suggests higher refund"
  ],
  "range": {
    "low": 2800.00,
    "high": 3600.00
  }
}`}</code>
        </pre>
      </Card>

      <Card className="p-8 bg-muted/50">
        <h2 className="text-2xl font-bold mb-4">Meet the AI Agents</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">Sophie - Document Analyst</h3>
            <p className="text-sm text-muted-foreground">
              Analyzes tax documents with AI vision, extracts data, and identifies document types with high accuracy.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">Leo - Refund Analyst</h3>
            <p className="text-sm text-muted-foreground">
              Calculates tax refunds, analyzes withholding patterns, and provides refund optimization strategies.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">Riley - Business Planner</h3>
            <p className="text-sm text-muted-foreground">
              Finds deductions and credits, identifies tax-saving opportunities, and provides business tax guidance.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">Kai - Audit Advisor</h3>
            <p className="text-sm text-muted-foreground">
              Assesses audit risk, ensures compliance, and provides documentation recommendations.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">Jordan - Tax Strategist</h3>
            <p className="text-sm text-muted-foreground">
              Creates long-term tax strategies, optimizes tax position, and provides personalized tax planning.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
