(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,644167,e=>{"use strict";var s=e.i(437322),a=e.i(621914),t=e.i(864159),r=e.i(333642);let l=(0,t.cva)("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});e.s(["Badge",0,function({className:e,variant:t,asChild:n=!1,...d}){let i=n?a.Slot:"span";return(0,s.jsx)(i,{"data-slot":"badge",className:(0,r.cn)(l({variant:t}),e),...d})}])},748599,e=>{"use strict";var s=e.i(437322),a=e.i(594950),t=e.i(644167);e.s(["default",0,function(){return(0,s.jsxs)("div",{className:"space-y-8",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h1",{className:"text-4xl font-bold mb-4",children:"Tax Calculation API"}),(0,s.jsx)("p",{className:"text-lg text-muted-foreground",children:"Calculate federal and state tax liability, estimate refunds, and analyze tax scenarios."})]}),(0,s.jsxs)(a.Card,{className:"p-8",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,s.jsx)(t.Badge,{variant:"default",children:"POST"}),(0,s.jsx)("code",{className:"text-lg",children:"/v1/tax/calculate"})]}),(0,s.jsx)("p",{className:"text-muted-foreground mb-6",children:"Calculate tax liability and estimated refund based on income and withholding data."}),(0,s.jsx)("h3",{className:"font-semibold mb-3",children:"Request Parameters"}),(0,s.jsxs)("div",{className:"space-y-3 mb-6",children:[(0,s.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,s.jsxs)("p",{className:"font-mono text-sm mb-1",children:["income ",(0,s.jsx)("span",{className:"text-muted-foreground",children:"(required)"})]}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total income amount in dollars"})]}),(0,s.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,s.jsxs)("p",{className:"font-mono text-sm mb-1",children:["federal_withheld ",(0,s.jsx)("span",{className:"text-muted-foreground",children:"(required)"})]}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:"Federal tax withheld in dollars"})]}),(0,s.jsxs)("div",{className:"border-l-2 border-muted pl-4",children:[(0,s.jsxs)("p",{className:"font-mono text-sm mb-1",children:["state_withheld ",(0,s.jsx)("span",{className:"text-muted-foreground",children:"(optional)"})]}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:"State tax withheld in dollars"})]}),(0,s.jsxs)("div",{className:"border-l-2 border-muted pl-4",children:[(0,s.jsxs)("p",{className:"font-mono text-sm mb-1",children:["filing_status ",(0,s.jsx)("span",{className:"text-muted-foreground",children:"(optional)"})]}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:"single, married_joint, married_separate, head_of_household. Default: single"})]}),(0,s.jsxs)("div",{className:"border-l-2 border-muted pl-4",children:[(0,s.jsxs)("p",{className:"font-mono text-sm mb-1",children:["deductions ",(0,s.jsx)("span",{className:"text-muted-foreground",children:"(optional)"})]}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:"Array of deduction objects with amount and category"})]}),(0,s.jsxs)("div",{className:"border-l-2 border-muted pl-4",children:[(0,s.jsxs)("p",{className:"font-mono text-sm mb-1",children:["credits ",(0,s.jsx)("span",{className:"text-muted-foreground",children:"(optional)"})]}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:"Array of tax credit objects with amount and type"})]})]}),(0,s.jsx)("h3",{className:"font-semibold mb-3",children:"Example Request"}),(0,s.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6",children:(0,s.jsx)("code",{children:String.raw`curl https://api.taxu.io/v1/tax/calculate \
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
  }'`})}),(0,s.jsx)("h3",{className:"font-semibold mb-3",children:"Response"}),(0,s.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm",children:(0,s.jsx)("code",{children:String.raw`{
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
}`})})]}),(0,s.jsxs)(a.Card,{className:"p-8",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,s.jsx)(t.Badge,{variant:"secondary",children:"GET"}),(0,s.jsx)("code",{className:"text-lg",children:"/v1/tax/calculations"})]}),(0,s.jsx)("p",{className:"text-muted-foreground mb-6",children:"List all tax calculations for the authenticated user."}),(0,s.jsx)("h3",{className:"font-semibold mb-3",children:"Query Parameters"}),(0,s.jsxs)("div",{className:"space-y-3 mb-6",children:[(0,s.jsxs)("div",{className:"border-l-2 border-muted pl-4",children:[(0,s.jsxs)("p",{className:"font-mono text-sm mb-1",children:["tax_year ",(0,s.jsx)("span",{className:"text-muted-foreground",children:"(optional)"})]}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:"Filter by tax year (e.g., 2024)"})]}),(0,s.jsxs)("div",{className:"border-l-2 border-muted pl-4",children:[(0,s.jsxs)("p",{className:"font-mono text-sm mb-1",children:["limit ",(0,s.jsx)("span",{className:"text-muted-foreground",children:"(optional)"})]}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:"Number of results to return (default: 10, max: 100)"})]})]}),(0,s.jsx)("h3",{className:"font-semibold mb-3",children:"Example Request"}),(0,s.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6",children:(0,s.jsx)("code",{children:String.raw`curl https://api.taxu.io/v1/tax/calculations?tax_year=2024&limit=10 \
  -H "Authorization: Bearer your_api_key"`})}),(0,s.jsx)("h3",{className:"font-semibold mb-3",children:"Response"}),(0,s.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm",children:(0,s.jsx)("code",{children:String.raw`{
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
}`})})]}),(0,s.jsxs)(a.Card,{className:"p-8 bg-muted/50",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Tax Calculation Details"}),(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{className:"font-semibold mb-2",children:"2024 Tax Brackets (Single Filers)"}),(0,s.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"$0 - $11,600"}),(0,s.jsx)("span",{className:"font-mono",children:"10%"})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"$11,601 - $47,150"}),(0,s.jsx)("span",{className:"font-mono",children:"12%"})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"$47,151 - $100,525"}),(0,s.jsx)("span",{className:"font-mono",children:"22%"})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"$100,526 - $191,950"}),(0,s.jsx)("span",{className:"font-mono",children:"24%"})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"$191,951 - $243,725"}),(0,s.jsx)("span",{className:"font-mono",children:"32%"})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"$243,726 - $609,350"}),(0,s.jsx)("span",{className:"font-mono",children:"35%"})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"$609,351+"}),(0,s.jsx)("span",{className:"font-mono",children:"37%"})]})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{className:"font-semibold mb-2",children:"Standard Deductions (2024)"}),(0,s.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"Single"}),(0,s.jsx)("span",{className:"font-mono",children:"$14,600"})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"Married Filing Jointly"}),(0,s.jsx)("span",{className:"font-mono",children:"$29,200"})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{children:"Head of Household"}),(0,s.jsx)("span",{className:"font-mono",children:"$21,900"})]})]})]})]})]})]})}])}]);