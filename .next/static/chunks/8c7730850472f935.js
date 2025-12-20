(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,994179,e=>{"use strict";var t=e.i(878957),i=e.i(589944),s=e.i(294237),a=e.i(647163);let r=(0,s.cva)("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});e.s(["Badge",0,function({className:e,variant:s,asChild:n=!1,...d}){let o=n?i.Slot:"span";return(0,t.jsx)(o,{"data-slot":"badge",className:(0,a.cn)(r({variant:s}),e),...d})}])},241394,e=>{"use strict";var t=e.i(878957),i=e.i(970065),s=e.i(994179);e.s(["default",0,function(){return(0,t.jsxs)("div",{className:"space-y-8",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-4xl font-bold mb-4",children:"AI Agents API"}),(0,t.jsx)("p",{className:"text-lg text-muted-foreground",children:"Leverage Taxu's AI agents for intelligent tax insights, optimization strategies, and predictive analytics."})]}),(0,t.jsxs)(i.Card,{className:"p-8",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,t.jsx)(s.Badge,{variant:"default",children:"POST"}),(0,t.jsx)("code",{className:"text-lg",children:"/v1/ai/insights"})]}),(0,t.jsx)("p",{className:"text-muted-foreground mb-6",children:"Generate intelligent tax insights from your data using AI analysis."}),(0,t.jsx)("h3",{className:"font-semibold mb-3",children:"Example Request"}),(0,t.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6",children:(0,t.jsx)("code",{children:String.raw`curl https://api.taxu.io/v1/ai/insights \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "income": 75000,
      "deductions": 5000,
      "tax_year": 2024
    }
  }'`})}),(0,t.jsx)("h3",{className:"font-semibold mb-3",children:"Response"}),(0,t.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm",children:(0,t.jsx)("code",{children:String.raw`{
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
}`})})]}),(0,t.jsxs)(i.Card,{className:"p-8",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,t.jsx)(s.Badge,{variant:"default",children:"POST"}),(0,t.jsx)("code",{className:"text-lg",children:"/v1/ai/optimize"})]}),(0,t.jsx)("p",{className:"text-muted-foreground mb-6",children:"Find tax optimization strategies tailored to your financial situation."}),(0,t.jsx)("h3",{className:"font-semibold mb-3",children:"Example Request"}),(0,t.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6",children:(0,t.jsx)("code",{children:String.raw`curl https://api.taxu.io/v1/ai/optimize \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "income": 75000,
    "federal_withheld": 12000,
    "filing_status": "single"
  }'`})}),(0,t.jsx)("h3",{className:"font-semibold mb-3",children:"Response"}),(0,t.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm",children:(0,t.jsx)("code",{children:String.raw`{
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
}`})})]}),(0,t.jsxs)(i.Card,{className:"p-8",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,t.jsx)(s.Badge,{variant:"default",children:"POST"}),(0,t.jsx)("code",{className:"text-lg",children:"/v1/ai/predict"})]}),(0,t.jsx)("p",{className:"text-muted-foreground mb-6",children:"Predict future tax refunds based on historical data and current trends."}),(0,t.jsx)("h3",{className:"font-semibold mb-3",children:"Example Request"}),(0,t.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6",children:(0,t.jsx)("code",{children:String.raw`curl https://api.taxu.io/v1/ai/predict \
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
  }'`})}),(0,t.jsx)("h3",{className:"font-semibold mb-3",children:"Response"}),(0,t.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm",children:(0,t.jsx)("code",{children:String.raw`{
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
}`})})]}),(0,t.jsxs)(i.Card,{className:"p-8 bg-muted/50",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Meet the AI Agents"}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2",children:[(0,t.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,t.jsx)("h3",{className:"font-semibold mb-2",children:"Sophie - Document Analyst"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Analyzes tax documents with AI vision, extracts data, and identifies document types with high accuracy."})]}),(0,t.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,t.jsx)("h3",{className:"font-semibold mb-2",children:"Leo - Refund Analyst"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Calculates tax refunds, analyzes withholding patterns, and provides refund optimization strategies."})]}),(0,t.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,t.jsx)("h3",{className:"font-semibold mb-2",children:"Riley - Business Planner"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Finds deductions and credits, identifies tax-saving opportunities, and provides business tax guidance."})]}),(0,t.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,t.jsx)("h3",{className:"font-semibold mb-2",children:"Kai - Audit Advisor"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Assesses audit risk, ensures compliance, and provides documentation recommendations."})]}),(0,t.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,t.jsx)("h3",{className:"font-semibold mb-2",children:"Jordan - Tax Strategist"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Creates long-term tax strategies, optimizes tax position, and provides personalized tax planning."})]})]})]})]})}])}]);