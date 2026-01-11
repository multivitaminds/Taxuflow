module.exports=[787030,a=>{"use strict";var b=a.i(108446),c=a.i(532360),d=a.i(728887),e=a.i(640065),f=a.i(937792),g=a.i(117462),h=a.i(830336),i=a.i(591028);function j({language:a,code:c}){let[d,h]=(0,g.useState)(!1);return(0,b.jsxs)("div",{className:"relative rounded-xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-[#30363d] overflow-hidden shadow-2xl",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm",children:[(0,b.jsx)("span",{className:"text-xs font-mono text-[#7d8590] uppercase tracking-wider font-semibold",children:a}),(0,b.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(c),h(!0),setTimeout(()=>h(!1),2e3)},className:"flex items-center gap-2 text-xs text-[#7d8590] hover:text-[#58a6ff] transition-colors px-2 py-1 rounded hover:bg-[#30363d]/50",children:d?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(f.Check,{className:"w-4 h-4 text-green-400"}),(0,b.jsx)("span",{className:"text-green-400",children:"Copied!"})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(e.Copy,{className:"w-4 h-4"}),"Copy"]})})]}),(0,b.jsx)("pre",{className:"p-4 overflow-x-auto",children:(0,b.jsx)(i.SyntaxHighlighter,{code:c,language:a})})]})}function k({method:a,path:c,title:d,description:e,requestExample:f,responseExample:g}){return(0,b.jsxs)("div",{className:"rounded-xl border border-border bg-card p-6 hover:border-primary/20 transition-colors",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,b.jsx)("span",{className:`px-3 py-1 rounded-lg text-xs font-mono font-semibold ${"GET"===a?"bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10":"POST"===a?"bg-green-500/10 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10":"bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10"}`,children:a}),(0,b.jsx)("code",{className:"font-mono text-sm text-foreground bg-background/50 px-3 py-1 rounded border border-border",children:c})]}),(0,b.jsx)("h3",{className:"text-xl font-bold mb-2 text-foreground",children:d}),(0,b.jsx)("p",{className:"text-foreground/70 mb-6 leading-relaxed",children:e}),f&&(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsxs)("h4",{className:"text-sm font-semibold mb-2 text-foreground flex items-center gap-2",children:[(0,b.jsx)("span",{className:"w-1 h-4 bg-blue-500 rounded-full"}),"Request"]}),(0,b.jsx)("div",{className:"rounded-lg bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-[#30363d] p-4 overflow-x-auto shadow-lg",children:(0,b.jsx)("pre",{className:"text-xs font-mono",children:(0,b.jsx)(i.SyntaxHighlighter,{code:f,language:"json"})})})]}),g&&(0,b.jsxs)("div",{children:[(0,b.jsxs)("h4",{className:"text-sm font-semibold mb-2 text-foreground flex items-center gap-2",children:[(0,b.jsx)("span",{className:"w-1 h-4 bg-green-500 rounded-full"}),"Response"]}),(0,b.jsx)("div",{className:"rounded-lg bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-[#30363d] p-4 overflow-x-auto shadow-lg",children:(0,b.jsx)("pre",{className:"text-xs font-mono",children:(0,b.jsx)(i.SyntaxHighlighter,{code:g,language:"json"})})})]})]})}a.s(["default",0,function(){return(0,b.jsxs)("main",{className:"min-h-screen",children:[(0,b.jsx)(c.Navigation,{}),(0,b.jsx)("div",{className:"pt-32 pb-20 px-4 sm:px-6 lg:px-8",children:(0,b.jsx)("div",{className:"container mx-auto max-w-7xl",children:(0,b.jsxs)("div",{className:"grid lg:grid-cols-[280px_1fr] gap-12",children:[(0,b.jsx)("aside",{className:"hidden lg:block",children:(0,b.jsxs)("div",{className:"sticky top-32 space-y-6",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"font-semibold mb-3 text-sm uppercase tracking-wider text-foreground/70",children:"Getting Started"}),(0,b.jsxs)("ul",{className:"space-y-2 text-sm",children:[(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#authentication",className:"text-primary hover:underline font-medium",children:"Authentication"})}),(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#quickstart",className:"text-foreground hover:text-primary transition-colors",children:"Quickstart"})}),(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#errors",className:"text-foreground hover:text-primary transition-colors",children:"Error Handling"})})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"font-semibold mb-3 text-sm uppercase tracking-wider text-foreground/70",children:"Core Resources"}),(0,b.jsxs)("ul",{className:"space-y-2 text-sm",children:[(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#filing",className:"text-foreground hover:text-primary transition-colors",children:"Tax Filing"})}),(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#documents",className:"text-foreground hover:text-primary transition-colors",children:"Documents"})}),(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#quickbooks",className:"text-foreground hover:text-primary transition-colors",children:"QuickBooks Sync"})})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"font-semibold mb-3 text-sm uppercase tracking-wider text-foreground/70",children:"Advanced"}),(0,b.jsxs)("ul",{className:"space-y-2 text-sm",children:[(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#webhooks",className:"text-foreground hover:text-primary transition-colors",children:"Webhooks"})}),(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#rate-limits",className:"text-foreground hover:text-primary transition-colors",children:"Rate Limits"})})]})]})]})}),(0,b.jsxs)("div",{className:"space-y-16",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-5xl font-bold mb-4 text-foreground",children:"API Documentation"}),(0,b.jsx)("p",{className:"text-xl text-foreground/70 leading-relaxed",children:"Complete reference for the Taxu REST API. Build tax intelligence into your application with our developer-first platform."})]}),(0,b.jsxs)("section",{id:"authentication",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-4 text-foreground",children:"Authentication"}),(0,b.jsx)("p",{className:"text-foreground/70 mb-6 leading-relaxed",children:"Authenticate your API requests using your secret API key in the Authorization header."}),(0,b.jsx)(j,{language:"bash",code:`curl https://api.taxu.ai/v1/returns \\
  -H "Authorization: Bearer sk_live_abc123xyz"`}),(0,b.jsx)("div",{className:"mt-4 p-4 rounded-lg bg-[#635bff]/10 border border-[#635bff]/20",children:(0,b.jsxs)("p",{className:"text-sm text-foreground",children:[(0,b.jsx)("strong",{className:"text-[#635bff] font-semibold",children:"Important:"})," Keep your API keys secure. Never expose them in client-side code or public repositories."]})})]}),(0,b.jsxs)("section",{id:"quickstart",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-4 text-foreground",children:"Quickstart"}),(0,b.jsx)("p",{className:"text-foreground/70 mb-6 leading-relaxed",children:"Get started with a simple refund estimate in under 5 minutes."}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-xl font-semibold mb-3 text-foreground",children:"1. Install the SDK"}),(0,b.jsx)(j,{language:"bash",code:`npm install @taxu/taxu-js
# or
pip install taxu-python  # Coming soon`})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-xl font-semibold mb-3 text-foreground",children:"2. Make your first request"}),(0,b.jsx)(j,{language:"javascript",code:`import { TaxuClient } from '@taxu/taxu-js';

const taxu = new TaxuClient('sk_live_abc123xyz');

const estimate = await taxu.refunds.estimate({
  income: 75000,
  filingStatus: 'single',
  deductions: ['standard']
});

console.log(estimate.refundAmount); // 2,450`})]}),(0,b.jsx)("div",{className:"p-4 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20",children:(0,b.jsxs)("p",{className:"text-sm text-foreground",children:[(0,b.jsx)("strong",{className:"text-[#00d4ff] font-semibold",children:"New:"})," JavaScript SDK is now available on npm."," ",(0,b.jsx)(h.default,{href:"/sdk/javascript",className:"underline text-primary hover:text-primary/80",children:"View documentation"})]})})]})]}),(0,b.jsxs)("section",{id:"filing",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-4 text-foreground",children:"Tax Filing"}),(0,b.jsx)("p",{className:"text-foreground/70 mb-6 leading-relaxed",children:"Submit tax forms including 1099-NEC, W-2, and Form 941 directly to the IRS via TaxBandits."}),(0,b.jsxs)("div",{className:"space-y-8",children:[(0,b.jsx)(k,{method:"POST",path:"/api/filing/submit-1099",title:"Submit 1099-NEC Form",description:"File 1099-NEC forms for contractors",requestExample:`{
  "businessName": "Acme Corp",
  "ein": "12-3456789",
  "recipients": [{
    "name": "John Contractor",
    "ssn": "123-45-6789",
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102",
    "compensation": 5000.00
  }]
}`,responseExample:`{
  "success": true,
  "submissionId": "sub_abc123",
  "status": "pending",
  "filingId": "filing_xyz789"
}`}),(0,b.jsx)(k,{method:"POST",path:"/api/filing/submit-w2",title:"Submit W-2 Form",description:"File W-2 forms for employees",requestExample:`{
  "employer": {
    "name": "Acme Corp",
    "ein": "12-3456789",
    "address": "456 Business Ave"
  },
  "employee": {
    "name": "Jane Employee",
    "ssn": "987-65-4321",
    "wages": 75000.00,
    "federalWithheld": 8500.00
  }
}`,responseExample:`{
  "success": true,
  "submissionId": "sub_def456",
  "status": "accepted"
}`}),(0,b.jsx)(k,{method:"GET",path:"/api/filing/status",title:"Get Filing Status",description:"Check the status of a submitted filing",responseExample:`{
  "filingId": "filing_xyz789",
  "status": "accepted",
  "submittedAt": "2025-01-15T10:30:00Z",
  "acceptedAt": "2025-01-15T10:35:00Z",
  "confirmationNumber": "IRS-2025-ABC123"
}`})]})]}),(0,b.jsxs)("section",{id:"documents",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-4 text-foreground",children:"Documents"}),(0,b.jsx)("p",{className:"text-foreground/70 mb-6 leading-relaxed",children:"Upload and extract data from tax documents using AI-powered OCR."}),(0,b.jsxs)("div",{className:"space-y-8",children:[(0,b.jsx)(k,{method:"POST",path:"/api/filing/upload-document",title:"Upload Document",description:"Upload W-2, 1099, or receipt documents",requestExample:`{
  "file": "base64_encoded_file",
  "filename": "w2-2024.pdf",
  "type": "w2"
}`,responseExample:`{
  "success": true,
  "url": "https://blob.vercel-storage.com/...",
  "documentId": "doc_abc123"
}`}),(0,b.jsx)(k,{method:"POST",path:"/api/filing/extract-document",title:"Extract Document Data",description:"Use AI to extract structured data from uploaded documents",requestExample:`{
  "documentUrl": "https://blob.vercel-storage.com/...",
  "documentType": "w2"
}`,responseExample:`{
  "success": true,
  "extractedData": {
    "employer": "Acme Corp",
    "ein": "12-3456789",
    "employee": "John Doe",
    "ssn": "123-45-6789",
    "wages": 75000.00,
    "federalWithheld": 8500.00
  }
}`})]})]}),(0,b.jsxs)("section",{id:"quickbooks",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-4 text-foreground",children:"QuickBooks Integration"}),(0,b.jsx)("p",{className:"text-foreground/70 mb-6 leading-relaxed",children:"Connect to QuickBooks and sync transaction data for tax categorization."}),(0,b.jsxs)("div",{className:"space-y-8",children:[(0,b.jsx)(k,{method:"GET",path:"/api/quickbooks/connect",title:"Connect QuickBooks",description:"Initiate OAuth flow to connect QuickBooks account",responseExample:`{
  "authUrl": "https://appcenter.intuit.com/connect/oauth2?..."
}`}),(0,b.jsx)(k,{method:"POST",path:"/api/quickbooks/sync",title:"Sync Transactions",description:"Pull transactions from QuickBooks and categorize for taxes",responseExample:`{
  "success": true,
  "transactionCount": 247,
  "categorized": 245,
  "needsReview": 2
}`})]})]}),(0,b.jsxs)("section",{id:"webhooks",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-4 text-foreground",children:"Webhooks"}),(0,b.jsx)("p",{className:"text-foreground/70 mb-6 leading-relaxed",children:"Receive real-time notifications when events occur in your Taxu account."}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"rounded-xl border border-border bg-card p-6",children:[(0,b.jsx)("h3",{className:"text-lg font-semibold mb-3 text-foreground",children:"Setting up webhooks"}),(0,b.jsxs)("ol",{className:"space-y-2 text-sm text-foreground/70 list-decimal list-inside",children:[(0,b.jsx)("li",{children:"Create a webhook endpoint on your server"}),(0,b.jsx)("li",{children:"Register the endpoint URL in your Taxu dashboard"}),(0,b.jsx)("li",{children:"Verify webhook signatures for security"}),(0,b.jsx)("li",{children:"Handle events and respond with 200 OK"})]})]}),(0,b.jsx)(j,{language:"javascript",code:`// Example webhook handler
app.post('/webhooks/taxu', (req, res) => {
  const event = req.body;
  
  switch(event.type) {
    case 'return.filed':
      console.log('Return filed:', event.data.returnId);
      break;
    case 'refund.issued':
      console.log('Refund issued:', event.data.amount);
      break;
  }
  
  res.status(200).send('OK');
});`})]})]}),(0,b.jsxs)("section",{id:"rate-limits",children:[(0,b.jsx)("h2",{className:"text-3xl font-bold mb-4 text-foreground",children:"Rate Limits"}),(0,b.jsx)("p",{className:"text-foreground/70 mb-6 leading-relaxed",children:"API requests are rate limited based on your plan tier."}),(0,b.jsx)("div",{className:"rounded-xl border border-border bg-card overflow-hidden",children:(0,b.jsxs)("table",{className:"w-full",children:[(0,b.jsx)("thead",{className:"bg-background-alt",children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{className:"text-left p-4 font-semibold text-foreground",children:"Plan"}),(0,b.jsx)("th",{className:"text-left p-4 font-semibold text-foreground",children:"Rate Limit"}),(0,b.jsx)("th",{className:"text-left p-4 font-semibold text-foreground",children:"Burst"})]})}),(0,b.jsxs)("tbody",{className:"divide-y divide-border",children:[(0,b.jsxs)("tr",{children:[(0,b.jsx)("td",{className:"p-4 text-foreground",children:"Developer"}),(0,b.jsx)("td",{className:"p-4 text-foreground/70",children:"100 req/min"}),(0,b.jsx)("td",{className:"p-4 text-foreground/70",children:"200 req/min"})]}),(0,b.jsxs)("tr",{children:[(0,b.jsx)("td",{className:"p-4 text-foreground",children:"Startup"}),(0,b.jsx)("td",{className:"p-4 text-foreground/70",children:"1,000 req/min"}),(0,b.jsx)("td",{className:"p-4 text-foreground/70",children:"2,000 req/min"})]}),(0,b.jsxs)("tr",{children:[(0,b.jsx)("td",{className:"p-4 text-foreground",children:"Business"}),(0,b.jsx)("td",{className:"p-4 text-foreground/70",children:"10,000 req/min"}),(0,b.jsx)("td",{className:"p-4 text-foreground/70",children:"20,000 req/min"})]}),(0,b.jsxs)("tr",{children:[(0,b.jsx)("td",{className:"p-4 text-foreground",children:"Enterprise"}),(0,b.jsx)("td",{className:"p-4 text-foreground/70",children:"Custom"}),(0,b.jsx)("td",{className:"p-4 text-foreground/70",children:"Custom"})]})]})]})})]})]})]})})}),(0,b.jsx)(d.Footer,{})]})}])}];

//# sourceMappingURL=app_api-docs_page_tsx_48af585e._.js.map