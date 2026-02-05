module.exports=[193695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},679659,a=>{a.n(a.i(526807))},825907,a=>{a.n(a.i(755716))},93079,a=>{a.n(a.i(267738))},623392,a=>{a.n(a.i(159229))},622202,a=>{a.n(a.i(912483))},386183,a=>{a.n(a.i(834095))},520766,a=>{"use strict";let b=(0,a.i(907167).default)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);a.s(["ArrowRight",0,b],520766)},705152,a=>{"use strict";let b=(0,a.i(907167).default)("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);a.s(["Terminal",0,b],705152)},587321,a=>{"use strict";let b=(0,a.i(907167).default)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);a.s(["Copy",0,b],587321)},544447,a=>{"use strict";let b=(0,a.i(907167).default)("Github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);a.s(["Github",0,b],544447)},763442,a=>{"use strict";var b=a.i(595459),c=a.i(327677),d=a.i(184658),e=a.i(736668),f=a.i(520766),g=a.i(587321),h=a.i(705152),i=a.i(544447),j=a.i(121634);a.s(["default",0,function(){let a=`import taxu

# Initialize client
client = taxu.Client(
    api_key="your_api_key",
    environment="production"  # or "sandbox"
)

# Estimate refund
estimate = client.refunds.estimate(
    income=75000,
    filing_status="single",
    deductions=["standard"]
)

print(f"Estimated refund: $" + str(estimate.amount))`,k=`# Create a new tax return
tax_return = client.returns.create(
    user_id="user_123",
    tax_year=2024,
    filing_status="married_jointly"
)

# Add income
client.returns.add_income(
    tax_return.id,
    type="W2",
    employer="Acme Corp",
    amount=85000
)

# File the return
filed = client.returns.file(tax_return.id)`,l=`# Upload and parse documents
with open("w2.pdf", "rb") as file:
    document = client.documents.upload(
        file=file,
        type="W2",
        return_id="ret_abc123"
    )

# Get parsed data
print(document.parsed)
# {'employer': 'Acme Corp', 'wages': 85000, ...}`,m=`import asyncio
from taxu import AsyncClient

async def main():
    client = AsyncClient(api_key="your_api_key")
    
    # All methods support async
    estimate = await client.refunds.estimate(
        income=75000,
        filing_status="single"
    )
    
    print(f"Refund: $" + str(estimate.amount))

asyncio.run(main())`;return(0,b.jsxs)("main",{className:"min-h-screen",children:[(0,b.jsx)(c.Navigation,{}),(0,b.jsx)("div",{className:"pt-32 pb-20 px-4 sm:px-6 lg:px-8",children:(0,b.jsxs)("div",{className:"container mx-auto max-w-4xl",children:[(0,b.jsxs)("div",{className:"mb-8 rounded-2xl border-2 border-accent bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-8 text-center glow-neon",children:[(0,b.jsx)(h.Terminal,{className:"w-12 h-12 text-accent mx-auto mb-4"}),(0,b.jsx)("h2",{className:"text-2xl font-bold mb-2",children:"Python SDK In Development"}),(0,b.jsx)("p",{className:"text-muted-foreground mb-6",children:"We're actively building the Python SDK. Star the repo on GitHub to get notified when it launches."}),(0,b.jsxs)("div",{className:"flex items-center justify-center gap-4",children:[(0,b.jsx)(j.default,{href:"https://github.com/taxu-io/taxu-python",target:"_blank",rel:"noopener noreferrer",children:(0,b.jsxs)(e.Button,{size:"lg",className:"glow-neon-strong",children:[(0,b.jsx)(i.Github,{className:"mr-2 h-5 w-5"}),"Star on GitHub",(0,b.jsx)(f.ArrowRight,{className:"ml-2 h-5 w-5"})]})}),(0,b.jsx)(j.default,{href:"/developer-portal",children:(0,b.jsx)(e.Button,{size:"lg",variant:"outline",className:"bg-transparent",children:"Join Waitlist"})})]})]}),(0,b.jsxs)("div",{className:"mb-12",children:[(0,b.jsx)("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-6",children:"Python SDK"}),(0,b.jsxs)("h1",{className:"text-5xl sm:text-6xl font-bold mb-6",children:["Build with ",(0,b.jsx)("span",{className:"text-glow",children:"Python"})]}),(0,b.jsx)("p",{className:"text-xl text-muted-foreground leading-relaxed",children:"Official Python SDK for integrating Taxu into your Django, Flask, FastAPI, or any Python application."})]}),(0,b.jsxs)("section",{className:"mb-16",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-6",children:"Installation"}),(0,b.jsx)("div",{className:"mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20",children:(0,b.jsxs)("p",{className:"text-sm text-amber-600 dark:text-amber-400",children:[(0,b.jsx)("strong",{children:"Coming Soon:"})," The taxu-python package will be available on PyPI."," ",(0,b.jsx)(j.default,{href:"https://github.com/taxu-io/taxu-python",className:"underline",target:"_blank",rel:"noopener noreferrer",children:"Follow progress on GitHub"})]})}),(0,b.jsxs)("div",{className:"rounded-xl border border-border bg-card p-6",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 text-sm text-muted-foreground",children:[(0,b.jsx)(h.Terminal,{className:"w-4 h-4"}),(0,b.jsx)("span",{children:"pip"})]}),(0,b.jsx)(e.Button,{size:"sm",variant:"ghost",children:(0,b.jsx)(g.Copy,{className:"w-4 h-4"})})]}),(0,b.jsx)("pre",{className:"font-mono text-accent",children:(0,b.jsx)("code",{children:"pip install taxu"})})]})]}),(0,b.jsxs)("section",{className:"mb-16",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-6",children:"Quick Start"}),(0,b.jsx)("div",{className:"rounded-xl border border-border bg-card p-6",children:(0,b.jsx)("pre",{className:"font-mono text-sm text-accent overflow-x-auto",children:(0,b.jsx)("code",{children:a})})})]}),(0,b.jsxs)("section",{className:"mb-16",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-6",children:"Core Features"}),(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)("div",{className:"rounded-xl border border-border bg-card p-6",children:[(0,b.jsx)("h3",{className:"text-xl font-bold mb-4",children:"Tax Returns"}),(0,b.jsx)("pre",{className:"font-mono text-sm text-accent overflow-x-auto",children:(0,b.jsx)("code",{children:k})})]}),(0,b.jsxs)("div",{className:"rounded-xl border border-border bg-card p-6",children:[(0,b.jsx)("h3",{className:"text-xl font-bold mb-4",children:"Document Upload"}),(0,b.jsx)("pre",{className:"font-mono text-sm text-accent overflow-x-auto",children:(0,b.jsx)("code",{children:l})})]}),(0,b.jsxs)("div",{className:"rounded-xl border border-border bg-card p-6",children:[(0,b.jsx)("h3",{className:"text-xl font-bold mb-4",children:"Async/Await Support"}),(0,b.jsx)("pre",{className:"font-mono text-sm text-accent overflow-x-auto",children:(0,b.jsx)("code",{children:m})})]})]})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-6",children:"Next Steps"}),(0,b.jsxs)("div",{className:"grid md:grid-cols-2 gap-6",children:[(0,b.jsxs)("div",{className:"rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all",children:[(0,b.jsx)("h3",{className:"text-xl font-bold mb-2",children:"API Reference"}),(0,b.jsx)("p",{className:"text-muted-foreground mb-4",children:"Complete documentation of all SDK methods"}),(0,b.jsx)(j.default,{href:"/developers#api-reference",children:(0,b.jsxs)(e.Button,{variant:"outline",className:"bg-transparent",children:["View Docs",(0,b.jsx)(f.ArrowRight,{className:"ml-2 w-4 h-4"})]})})]}),(0,b.jsxs)("div",{className:"rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all",children:[(0,b.jsx)("h3",{className:"text-xl font-bold mb-2",children:"Example Apps"}),(0,b.jsx)("p",{className:"text-muted-foreground mb-4",children:"Full working examples on GitHub"}),(0,b.jsx)(j.default,{href:"https://github.com/taxu/examples",target:"_blank",rel:"noopener noreferrer",children:(0,b.jsxs)(e.Button,{className:"bg-accent hover:bg-accent/90 text-accent-foreground",children:["Browse Examples",(0,b.jsx)(f.ArrowRight,{className:"ml-2 h-5 w-5"})]})})]})]})]})]})}),(0,b.jsx)(d.Footer,{})]})},"dynamic",0,"force-static"])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__8fa76320._.js.map