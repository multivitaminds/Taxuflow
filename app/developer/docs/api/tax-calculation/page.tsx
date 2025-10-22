"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TaxCalculationAPIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Tax Calculation API</h1>
        <p className="text-lg text-muted-foreground">
          Calculate federal and state tax liability, estimate refunds, and analyze tax scenarios.
        </p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="default">POST</Badge>
          <code className="text-lg">/v1/tax/calculate</code>
        </div>
        <p className="text-muted-foreground mb-6">
          Calculate tax liability and estimated refund based on income and withholding data.
        </p>

        <h3 className="font-semibold mb-3">Request Parameters</h3>
        <div className="space-y-3 mb-6">
          <div className="border-l-2 border-primary pl-4">
            <p className="font-mono text-sm mb-1">
              income <span className="text-muted-foreground">(required)</span>
            </p>
            <p className="text-sm text-muted-foreground">Total income amount in dollars</p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <p className="font-mono text-sm mb-1">
              federal_withheld <span className="text-muted-foreground">(required)</span>
            </p>
            <p className="text-sm text-muted-foreground">Federal tax withheld in dollars</p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-mono text-sm mb-1">
              state_withheld <span className="text-muted-foreground">(optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">State tax withheld in dollars</p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-mono text-sm mb-1">
              filing_status <span className="text-muted-foreground">(optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">
              single, married_joint, married_separate, head_of_household. Default: single
            </p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-mono text-sm mb-1">
              deductions <span className="text-muted-foreground">(optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">Array of deduction objects with amount and category</p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-mono text-sm mb-1">
              credits <span className="text-muted-foreground">(optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">Array of tax credit objects with amount and type</p>
          </div>
        </div>

        <h3 className="font-semibold mb-3">Example Request</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
          <code>{String.raw`curl https://api.taxu.io/v1/tax/calculate \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "income": 75000,
    "federal_withheld": 12500,
    "state_withheld": 3750,
    "filing_status": "single",
    "deductions": [
      {
        "category": "student_loan_interest",
        "amount": 2500
      }
    ],
    "credits": [
      {
        "type": "savers_credit",
        "amount": 1000
      }
    ]
  }'`}</code>
        </pre>

        <h3 className="font-semibold mb-3">Response</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`{
  "id": "calc_1234567890",
  "object": "tax_calculation",
  "created": 1704067200,
  "total_income": 75000.00,
  "adjusted_gross_income": 72500.00,
  "taxable_income": 57900.00,
  "standard_deduction": 14600.00,
  "itemized_deductions": 2500.00,
  "federal_tax_liability": 8234.50,
  "state_tax_liability": 3625.00,
  "total_tax_liability": 11859.50,
  "total_withheld": 16250.00,
  "estimated_refund": 4390.50,
  "amount_owed": 0.00,
  "effective_tax_rate": 15.81,
  "marginal_tax_rate": 22.00,
  "confidence_level": "high",
  "confidence_percentage": 96,
  "tax_year": 2024,
  "breakdown": {
    "federal": {
      "bracket_10": 1160.00,
      "bracket_12": 4266.00,
      "bracket_22": 2808.50,
      "total": 8234.50
    },
    "state": {
      "rate": 5.00,
      "total": 3625.00
    }
  }
}`}</code>
        </pre>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary">GET</Badge>
          <code className="text-lg">/v1/tax/calculations</code>
        </div>
        <p className="text-muted-foreground mb-6">List all tax calculations for the authenticated user.</p>

        <h3 className="font-semibold mb-3">Query Parameters</h3>
        <div className="space-y-3 mb-6">
          <div className="border-l-2 border-muted pl-4">
            <p className="font-mono text-sm mb-1">
              tax_year <span className="text-muted-foreground">(optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">Filter by tax year (e.g., 2024)</p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-mono text-sm mb-1">
              limit <span className="text-muted-foreground">(optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">Number of results to return (default: 10, max: 100)</p>
          </div>
        </div>

        <h3 className="font-semibold mb-3">Example Request</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
          <code>{String.raw`curl https://api.taxu.io/v1/tax/calculations?tax_year=2024&limit=10 \
  -H "Authorization: Bearer your_api_key"`}</code>
        </pre>

        <h3 className="font-semibold mb-3">Response</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`{
  "object": "list",
  "data": [
    {
      "id": "calc_1234567890",
      "object": "tax_calculation",
      "created": 1704067200,
      "total_income": 75000.00,
      "estimated_refund": 4390.50,
      "tax_year": 2024
    }
  ],
  "has_more": false,
  "total_count": 1
}`}</code>
        </pre>
      </Card>

      <Card className="p-8 bg-muted/50">
        <h2 className="text-2xl font-bold mb-4">Tax Calculation Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">2024 Tax Brackets (Single Filers)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>$0 - $11,600</span>
                <span className="font-mono">10%</span>
              </div>
              <div className="flex justify-between">
                <span>$11,601 - $47,150</span>
                <span className="font-mono">12%</span>
              </div>
              <div className="flex justify-between">
                <span>$47,151 - $100,525</span>
                <span className="font-mono">22%</span>
              </div>
              <div className="flex justify-between">
                <span>$100,526 - $191,950</span>
                <span className="font-mono">24%</span>
              </div>
              <div className="flex justify-between">
                <span>$191,951 - $243,725</span>
                <span className="font-mono">32%</span>
              </div>
              <div className="flex justify-between">
                <span>$243,726 - $609,350</span>
                <span className="font-mono">35%</span>
              </div>
              <div className="flex justify-between">
                <span>$609,351+</span>
                <span className="font-mono">37%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Standard Deductions (2024)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Single</span>
                <span className="font-mono">$14,600</span>
              </div>
              <div className="flex justify-between">
                <span>Married Filing Jointly</span>
                <span className="font-mono">$29,200</span>
              </div>
              <div className="flex justify-between">
                <span>Head of Household</span>
                <span className="font-mono">$21,900</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
