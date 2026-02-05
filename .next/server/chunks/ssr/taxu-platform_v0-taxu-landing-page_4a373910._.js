module.exports=[930661,a=>{"use strict";var b=a.i(163942);a.s(["Check",()=>b.default])},303905,a=>{"use strict";let b=(0,a.i(540567).default)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);a.s(["Copy",0,b],303905)},761704,a=>{"use strict";let b=(0,a.i(540567).default)("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);a.s(["Play",0,b],761704)},571005,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={default:function(){return k},getImageProps:function(){return j}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(160978),g=a.r(551813),h=a.r(706436),i=f._(a.r(384472));function j(a){let{props:b}=(0,g.getImgProps)(a,{defaultLoader:i.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[a,c]of Object.entries(b))void 0===c&&delete b[a];return{props:b}}let k=h.Image},197790,(a,b,c)=>{b.exports=a.r(571005)},421268,a=>{"use strict";var b=a.i(24500),c=a.i(598293),d=a.i(27866),e=a.i(419716),f=a.i(296465),g=a.i(761704),h=a.i(303905),i=a.i(930661),j=a.i(197790);a.s(["default",0,function(){let[a,k]=(0,c.useState)("sk_test_..."),[l,m]=(0,c.useState)("/v1/tax/calculate-refund"),[n,o]=(0,c.useState)("POST"),[p,q]=(0,c.useState)(`{
  "filingStatus": "single",
  "income": 75000,
  "deductions": {
    "standard": true
  },
  "year": 2024
}`),[r,s]=(0,c.useState)(""),[t,u]=(0,c.useState)(!1),[v,w]=(0,c.useState)(!1),x=[{value:"/v1/tax/calculate-refund",label:"Calculate Refund",method:"POST"},{value:"/v1/documents/upload",label:"Upload Document",method:"POST"},{value:"/v1/documents/:id",label:"Get Document",method:"GET"},{value:"/v1/accounting/invoices",label:"List Invoices",method:"GET"},{value:"/v1/ai/chat",label:"AI Chat",method:"POST"}],y=async()=>{u(!0),setTimeout(()=>{s(JSON.stringify({success:!0,data:{estimatedRefund:2450,federalRefund:1800,stateRefund:650,effectiveTaxRate:.18,breakdown:{totalIncome:75e3,standardDeduction:14600,taxableIncome:60400,totalTax:8650,withheld:11100}},timestamp:new Date().toISOString()},null,2)),u(!1)},1500)};return(0,b.jsx)("div",{className:"min-h-screen bg-background",children:(0,b.jsxs)("div",{className:"max-w-7xl mx-auto px-6 py-12",children:[(0,b.jsxs)("div",{className:"mb-8",children:[(0,b.jsx)("h1",{className:"text-4xl font-bold text-foreground mb-4",children:"API Playground"}),(0,b.jsx)("p",{className:"text-xl text-muted-foreground",children:"Test Taxu APIs interactively with live requests and responses"})]}),(0,b.jsxs)("div",{className:"grid lg:grid-cols-2 gap-6",children:[(0,b.jsx)("div",{className:"space-y-6",children:(0,b.jsxs)(d.Card,{className:"bg-card border-border p-6 shadow-lg",children:[(0,b.jsx)("h2",{className:"text-xl font-bold text-foreground mb-4",children:"Request"}),(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-muted-foreground mb-2",children:"API Key"}),(0,b.jsx)("input",{type:"password",value:a,onChange:a=>k(a.target.value),className:"w-full bg-muted/50 border border-input rounded px-3 py-2 text-foreground font-mono text-sm focus:ring-2 focus:ring-primary",placeholder:"sk_test_..."})]}),(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-muted-foreground mb-2",children:"Endpoint"}),(0,b.jsx)("select",{value:l,onChange:a=>{m(a.target.value);let b=x.find(b=>b.value===a.target.value);b&&o(b.method)},className:"w-full bg-muted/50 border border-input rounded px-3 py-2 text-foreground focus:ring-2 focus:ring-primary",children:x.map(a=>(0,b.jsx)("option",{value:a.value,children:a.label},a.value))})]}),(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-muted-foreground mb-2",children:"Method"}),(0,b.jsx)("div",{className:"flex gap-2",children:["GET","POST","PUT","DELETE"].map(a=>(0,b.jsx)(e.Button,{variant:n===a?"default":"outline",size:"sm",onClick:()=>o(a),className:n===a?"bg-primary text-primary-foreground":"border-border hover:bg-muted",children:a},a))})]}),("POST"===n||"PUT"===n)&&(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-muted-foreground mb-2",children:"Request Body"}),(0,b.jsx)("textarea",{value:p,onChange:a=>q(a.target.value),className:"w-full bg-muted/50 border border-input rounded px-3 py-2 text-foreground font-mono text-sm h-64 focus:ring-2 focus:ring-primary"})]}),(0,b.jsxs)(e.Button,{onClick:y,disabled:t,className:"w-full bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground shadow-lg",children:[(0,b.jsx)(g.Play,{className:"w-4 h-4 mr-2"}),t?"Running...":"Run Request"]})]})}),(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)(d.Card,{className:"bg-card border-border p-6 shadow-lg",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsx)("h2",{className:"text-xl font-bold text-foreground",children:"Response"}),r&&(0,b.jsx)(e.Button,{size:"sm",variant:"ghost",onClick:()=>{navigator.clipboard.writeText(r),w(!0),setTimeout(()=>w(!1),2e3)},className:"text-muted-foreground hover:text-foreground",children:v?(0,b.jsx)(i.Check,{className:"w-4 h-4"}):(0,b.jsx)(h.Copy,{className:"w-4 h-4"})})]}),r?(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-3",children:[(0,b.jsx)("span",{className:"px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded font-medium",children:"200 OK"}),(0,b.jsx)("span",{className:"text-xs text-muted-foreground",children:"1.2s"})]}),(0,b.jsx)("pre",{className:"bg-gradient-to-br from-muted/80 to-muted rounded-lg p-4 text-foreground font-mono text-sm overflow-x-auto max-h-[600px] border border-border shadow-inner",children:r})]}):(0,b.jsx)("div",{className:"flex items-center justify-center h-64 text-muted-foreground",children:"Run a request to see the response"})]}),r&&(0,b.jsxs)(d.Card,{className:"bg-gradient-to-br from-primary/5 to-accent/5 border-border p-6 shadow-lg",children:[(0,b.jsx)("h3",{className:"text-lg font-bold text-foreground mb-4",children:"Generate Code"}),(0,b.jsxs)(f.Tabs,{defaultValue:"nodejs",children:[(0,b.jsxs)(f.TabsList,{className:"bg-muted flex-wrap h-auto",children:[(0,b.jsxs)(f.TabsTrigger,{value:"nodejs",className:"flex items-center gap-2",children:[(0,b.jsx)(j.default,{src:"/icons/nodejs.png",alt:"Node.js",width:16,height:16,className:"w-4 h-4"}),"Node.js"]}),(0,b.jsxs)(f.TabsTrigger,{value:"python",className:"flex items-center gap-2",children:[(0,b.jsx)(j.default,{src:"/icons/python.png",alt:"Python",width:16,height:16,className:"w-4 h-4"}),"Python"]}),(0,b.jsxs)(f.TabsTrigger,{value:"ruby",className:"flex items-center gap-2",children:[(0,b.jsx)(j.default,{src:"/icons/ruby.png",alt:"Ruby",width:16,height:16,className:"w-4 h-4"}),"Ruby"]}),(0,b.jsxs)(f.TabsTrigger,{value:"php",className:"flex items-center gap-2",children:[(0,b.jsx)(j.default,{src:"/icons/php.png",alt:"PHP",width:16,height:16,className:"w-4 h-4"}),"PHP"]}),(0,b.jsxs)(f.TabsTrigger,{value:"go",className:"flex items-center gap-2",children:[(0,b.jsx)(j.default,{src:"/icons/go.png",alt:"Go",width:16,height:16,className:"w-4 h-4"}),"Go"]}),(0,b.jsxs)(f.TabsTrigger,{value:"java",className:"flex items-center gap-2",children:[(0,b.jsx)(j.default,{src:"/icons/java.png",alt:"Java",width:16,height:16,className:"w-4 h-4"}),"Java"]}),(0,b.jsxs)(f.TabsTrigger,{value:"dotnet",className:"flex items-center gap-2",children:[(0,b.jsx)(j.default,{src:"/icons/dotnet.png",alt:".NET",width:16,height:16,className:"w-4 h-4"}),".NET"]}),(0,b.jsxs)(f.TabsTrigger,{value:"curl",className:"flex items-center gap-2",children:[(0,b.jsx)(j.default,{src:"/icons/curl.png",alt:"cURL",width:16,height:16,className:"w-4 h-4"}),"cURL"]})]}),(0,b.jsx)(f.TabsContent,{value:"nodejs",children:(0,b.jsx)("pre",{className:"bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-emerald-400 font-mono text-xs overflow-x-auto border border-primary/20 shadow-lg",children:`const taxu = require('@taxu/node');

const client = new taxu('${a}');

const result = await client.tax.calculateRefund(${p});

console.log(result);`})}),(0,b.jsx)(f.TabsContent,{value:"python",children:(0,b.jsx)("pre",{className:"bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-cyan-400 font-mono text-xs overflow-x-auto border border-accent/20 shadow-lg",children:`import taxu

client = taxu.Client('${a}')

result = client.tax.calculate_refund(${p})

print(result)`})}),(0,b.jsx)(f.TabsContent,{value:"ruby",children:(0,b.jsx)("pre",{className:"bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-red-400 font-mono text-xs overflow-x-auto border border-red-500/20 shadow-lg",children:`require 'taxu'

client = Taxu::Client.new('${a}')

result = client.tax.calculate_refund(${p})

puts result`})}),(0,b.jsx)(f.TabsContent,{value:"php",children:(0,b.jsx)("pre",{className:"bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-purple-400 font-mono text-xs overflow-x-auto border border-purple-500/20 shadow-lg",children:`<?php
require 'vendor/autoload.php';

$client = new \\Taxu\\Client('${a}');

$result = $client->tax->calculateRefund(${p});

print_r($result);`})}),(0,b.jsx)(f.TabsContent,{value:"go",children:(0,b.jsx)("pre",{className:"bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-cyan-300 font-mono text-xs overflow-x-auto border border-cyan-500/20 shadow-lg",children:`package main

import (
    "github.com/taxu/taxu-go"
    "fmt"
)

func main() {
    client := taxu.NewClient("${a}")
    
    result, _ := client.Tax.CalculateRefund(${p})
    
    fmt.Println(result)
}`})}),(0,b.jsx)(f.TabsContent,{value:"java",children:(0,b.jsx)("pre",{className:"bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-orange-400 font-mono text-xs overflow-x-auto border border-orange-500/20 shadow-lg",children:`import com.taxu.Taxu;
import com.taxu.model.TaxRefund;

public class Main {
    public static void main(String[] args) {
        Taxu taxu = new Taxu("${a}");
        
        TaxRefund result = taxu.tax()
            .calculateRefund(${p});
        
        System.out.println(result);
    }
}`})}),(0,b.jsx)(f.TabsContent,{value:"dotnet",children:(0,b.jsx)("pre",{className:"bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-indigo-400 font-mono text-xs overflow-x-auto border border-indigo-500/20 shadow-lg",children:`using Taxu;

var client = new TaxuClient("${a}");

var result = await client.Tax.CalculateRefundAsync(${p});

Console.WriteLine(result);`})}),(0,b.jsx)(f.TabsContent,{value:"curl",children:(0,b.jsx)("pre",{className:"bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-amber-400 font-mono text-xs overflow-x-auto border border-chart-5/20 shadow-lg",children:`curl -X ${n} https://api.taxu.io${l} \\
  -H "Authorization: Bearer ${a}" \\
  -H "Content-Type: application/json" \\
  -d '${p}'`})})]})]})]})]})]})})}])}];

//# sourceMappingURL=taxu-platform_v0-taxu-landing-page_4a373910._.js.map