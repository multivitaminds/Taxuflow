module.exports=[676996,a=>{"use strict";var b=a.i(24500),c=a.i(180798),d=a.i(116964),e=a.i(439668);let f=(0,d.cva)("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});a.s(["Badge",0,function({className:a,variant:d,asChild:g=!1,...h}){let i=g?c.Slot:"span";return(0,b.jsx)(i,{"data-slot":"badge",className:(0,e.cn)(f({variant:d}),a),...h})}])},595022,a=>{"use strict";var b=a.i(24500),c=a.i(27866),d=a.i(676996);a.s(["default",0,function(){return(0,b.jsxs)("div",{className:"space-y-8",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-4xl font-bold mb-4",children:"Chat API"}),(0,b.jsx)("p",{className:"text-lg text-muted-foreground",children:"Integrate conversational AI tax assistance into your application with streaming responses."})]}),(0,b.jsxs)(c.Card,{className:"p-8",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,b.jsx)(d.Badge,{variant:"default",children:"POST"}),(0,b.jsx)("code",{className:"text-lg",children:"/v1/chat"})]}),(0,b.jsx)("p",{className:"text-muted-foreground mb-6",children:"Send messages to AI tax agents and receive streaming responses in real-time."}),(0,b.jsx)("h3",{className:"font-semibold mb-3",children:"Request Parameters"}),(0,b.jsxs)("div",{className:"space-y-3 mb-6",children:[(0,b.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,b.jsxs)("p",{className:"font-mono text-sm mb-1",children:["messages ",(0,b.jsx)("span",{className:"text-muted-foreground",children:"(required)"})]}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Array of message objects with role and content"})]}),(0,b.jsxs)("div",{className:"border-l-2 border-muted pl-4",children:[(0,b.jsxs)("p",{className:"font-mono text-sm mb-1",children:["agent ",(0,b.jsx)("span",{className:"text-muted-foreground",children:"(optional)"})]}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Agent name: Sophie, Leo, Riley, Kai, Jordan. Default: Sophie"})]}),(0,b.jsxs)("div",{className:"border-l-2 border-muted pl-4",children:[(0,b.jsxs)("p",{className:"font-mono text-sm mb-1",children:["model ",(0,b.jsx)("span",{className:"text-muted-foreground",children:"(optional)"})]}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"AI model: openai/gpt-4o-mini, openai/gpt-4o. Default: gpt-4o-mini"})]})]}),(0,b.jsx)("h3",{className:"font-semibold mb-3",children:"Example Request"}),(0,b.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6",children:(0,b.jsx)("code",{children:String.raw`curl https://api.taxu.io/v1/chat \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Can I deduct my home office expenses?"
      }
    ],
    "agent": "Riley"
  }'`})}),(0,b.jsx)("h3",{className:"font-semibold mb-3",children:"Response (Streaming)"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground mb-3",children:"The API returns a streaming text response. Each chunk is sent as plain text:"}),(0,b.jsx)("pre",{className:"bg-muted p-4 rounded-lg overflow-x-auto text-sm",children:(0,b.jsx)("code",{children:String.raw`Yes, you can deduct home office expenses if you meet certain criteria...`})})]}),(0,b.jsxs)(c.Card,{className:"p-8",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Available Agents"}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,b.jsx)("h3",{className:"font-semibold mb-1",children:"Sophie - Filing Assistant"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Friendly and patient, helps with tax filing basics and explains complex concepts simply."})]}),(0,b.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,b.jsx)("h3",{className:"font-semibold mb-1",children:"Jordan - Deduction Detective"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Analytical expert who finds every legitimate deduction and credit opportunity."})]}),(0,b.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,b.jsx)("h3",{className:"font-semibold mb-1",children:"Kai - Audit Shield"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Meticulous specialist focused on minimizing audit risk and ensuring compliance."})]}),(0,b.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,b.jsx)("h3",{className:"font-semibold mb-1",children:"Riley - Business Tax Pro"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Savvy business tax specialist for self-employment and corporate structures."})]}),(0,b.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,b.jsx)("h3",{className:"font-semibold mb-1",children:"Leo - Tax Strategist"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Sophisticated planner for long-term tax optimization and wealth management."})]})]})]}),(0,b.jsxs)(c.Card,{className:"p-8 bg-muted/50",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Integration Example"}),(0,b.jsx)("pre",{className:"bg-background p-4 rounded-lg overflow-x-auto text-sm",children:(0,b.jsx)("code",{children:String.raw`// JavaScript/Node.js example with streaming
const response = await fetch('https://api.taxu.io/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'What deductions can I claim?' }
    ],
    agent: 'Riley'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  console.log(chunk); // Process each chunk as it arrives
}`})})]})]})}])}];

//# sourceMappingURL=taxu-platform_v0-taxu-landing-page_bfbf48f6._.js.map