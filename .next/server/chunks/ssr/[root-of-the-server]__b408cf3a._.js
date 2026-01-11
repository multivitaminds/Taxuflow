module.exports=[193695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},994367,a=>{a.n(a.i(216893))},70864,a=>{a.n(a.i(233290))},565897,a=>{a.n(a.i(396647))},655617,a=>{a.n(a.i(149727))},852490,a=>{a.n(a.i(20038))},233171,a=>{a.n(a.i(14676))},221236,a=>{"use strict";var b=a.i(340014);let c=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim();var d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let e=(0,b.forwardRef)(({color:a="currentColor",size:e=24,strokeWidth:f=2,absoluteStrokeWidth:g,className:h="",children:i,iconNode:j,...k},l)=>(0,b.createElement)("svg",{ref:l,...d,width:e,height:e,stroke:a,strokeWidth:g?24*Number(f)/Number(e):f,className:c("lucide",h),...k},[...j.map(([a,c])=>(0,b.createElement)(a,c)),...Array.isArray(i)?i:[i]]));a.s(["default",0,(a,d)=>{let f=(0,b.forwardRef)(({className:f,...g},h)=>(0,b.createElement)(e,{ref:h,iconNode:d,className:c(`lucide-${a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,f),...g}));return f.displayName=`${a}`,f}],221236)},254508,(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}c._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}},841748,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(845632);a.n(d("[project]/node_modules/.pnpm/next@16.1.1-canary.1_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.40._9c40219f24b46b2f1adae4f0f03b6dfe/node_modules/next/dist/client/app-dir/link.js <module evaluation>"))},806686,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(845632);a.n(d("[project]/node_modules/.pnpm/next@16.1.1-canary.1_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.40._9c40219f24b46b2f1adae4f0f03b6dfe/node_modules/next/dist/client/app-dir/link.js"))},155250,a=>{"use strict";a.i(841748);var b=a.i(806686);a.n(b)},193806,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={default:function(){return i},useLinkStatus:function(){return h.useLinkStatus}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(254508),g=a.r(527155),h=f._(a.r(155250));function i(a){let b=a.legacyBehavior,c="string"==typeof a.children||"number"==typeof a.children||"string"==typeof a.children?.type,d=a.children?.type?.$$typeof===Symbol.for("react.client.reference");return!b||c||d||(a.children?.type?.$$typeof===Symbol.for("react.lazy")?console.error("Using a Lazy Component as a direct child of `<Link legacyBehavior>` from a Server Component is not supported. If you need legacyBehavior, wrap your Lazy Component in a Client Component that renders the Link's `<a>` tag."):console.error("Using a Server Component as a direct child of `<Link legacyBehavior>` is not supported. If you need legacyBehavior, wrap your Server Component in a Client Component that renders the Link's `<a>` tag.")),(0,g.jsx)(h.default,{...a})}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},480290,708111,a=>{"use strict";let b,c,d;var e=a.i(340014);function f(a,b){if("function"==typeof a)return a(b);null!=a&&(a.current=b)}var g=a.i(527155),h=Symbol.for("react.lazy"),i=e[" use ".trim().toString()];function j(a){var b;return null!=a&&"object"==typeof a&&"$$typeof"in a&&a.$$typeof===h&&"_payload"in a&&"object"==typeof(b=a._payload)&&null!==b&&"then"in b}var k=((d=e.forwardRef((a,b)=>{let{children:c,...d}=a;if(j(c)&&"function"==typeof i&&(c=i(c._payload)),e.isValidElement(c)){var g;let a,h,i=(g=c,(h=(a=Object.getOwnPropertyDescriptor(g.props,"ref")?.get)&&"isReactWarning"in a&&a.isReactWarning)?g.ref:(h=(a=Object.getOwnPropertyDescriptor(g,"ref")?.get)&&"isReactWarning"in a&&a.isReactWarning)?g.props.ref:g.props.ref||g.ref),j=function(a,b){let c={...b};for(let d in b){let e=a[d],f=b[d];/^on[A-Z]/.test(d)?e&&f?c[d]=(...a)=>{let b=f(...a);return e(...a),b}:e&&(c[d]=e):"style"===d?c[d]={...e,...f}:"className"===d&&(c[d]=[e,f].filter(Boolean).join(" "))}return{...a,...c}}(d,c.props);return c.type!==e.Fragment&&(j.ref=b?function(...a){return b=>{let c=!1,d=a.map(a=>{let d=f(a,b);return c||"function"!=typeof d||(c=!0),d});if(c)return()=>{for(let b=0;b<d.length;b++){let c=d[b];"function"==typeof c?c():f(a[b],null)}}}}(b,i):i),e.cloneElement(c,j)}return e.Children.count(c)>1?e.Children.only(null):null})).displayName="Slot.SlotClone",b=d,(c=e.forwardRef((a,c)=>{let{children:d,...f}=a;j(d)&&"function"==typeof i&&(d=i(d._payload));let h=e.Children.toArray(d),k=h.find(m);if(k){let a=k.props.children,d=h.map(b=>b!==k?b:e.Children.count(a)>1?e.Children.only(null):e.isValidElement(a)?a.props.children:null);return(0,g.jsx)(b,{...f,ref:c,children:e.isValidElement(a)?e.cloneElement(a,void 0,d):null})}return(0,g.jsx)(b,{...f,ref:c,children:d})})).displayName="Slot.Slot",c),l=Symbol("radix.slottable");function m(a){return e.isValidElement(a)&&"function"==typeof a.type&&"__radixId"in a.type&&a.type.__radixId===l}a.s(["Slot",0,k],480290);var n=a.i(668962);let o=a=>"boolean"==typeof a?`${a}`:0===a?"0":a,p=n.clsx;a.s(["cva",0,(a,b)=>c=>{var d;if((null==b?void 0:b.variants)==null)return p(a,null==c?void 0:c.class,null==c?void 0:c.className);let{variants:e,defaultVariants:f}=b,g=Object.keys(e).map(a=>{let b=null==c?void 0:c[a],d=null==f?void 0:f[a];if(null===b)return null;let g=o(b)||o(d);return e[a][g]}),h=c&&Object.entries(c).reduce((a,b)=>{let[c,d]=b;return void 0===d||(a[c]=d),a},{});return p(a,g,null==b||null==(d=b.compoundVariants)?void 0:d.reduce((a,b)=>{let{class:c,className:d,...e}=b;return Object.entries(e).every(a=>{let[b,c]=a;return Array.isArray(c)?c.includes({...f,...h}[b]):({...f,...h})[b]===c})?[...a,c,d]:a},[]),null==c?void 0:c.class,null==c?void 0:c.className)}],708111)},943917,a=>{"use strict";var b=a.i(527155),c=a.i(480290),d=a.i(708111),e=a.i(182248);let f=(0,d.cva)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-sm hover:shadow-md active:shadow-none active:translate-y-[1px]",{variants:{variant:{default:"bg-[#635bff] text-white hover:bg-[#635bff]/90 hover:shadow-lg",destructive:"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-[#0a2540] text-white hover:bg-[#0a2540]/90",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 shadow-none hover:shadow-none",link:"text-[#635bff] underline-offset-4 hover:underline shadow-none hover:shadow-none"},size:{default:"h-10 px-5 py-2 has-[>svg]:px-4",sm:"h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",lg:"h-12 rounded-full px-8 has-[>svg]:px-6 text-base",icon:"size-10 rounded-full","icon-sm":"size-8 rounded-full","icon-lg":"size-12 rounded-full"}},defaultVariants:{variant:"default",size:"default"}});a.s(["Button",0,function({className:a,variant:d,size:g,asChild:h=!1,...i}){let j=h?c.Slot:"button";return(0,b.jsx)(j,{"data-slot":"button",className:(0,e.cn)(f({variant:d,size:g,className:a})),...i})}])},456843,a=>{"use strict";let b=(0,a.i(221236).default)("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);a.s(["Shield",0,b],456843)},636243,a=>{"use strict";let b=(0,a.i(221236).default)("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);a.s(["Zap",0,b],636243)},673860,a=>{"use strict";let b=(0,a.i(221236).default)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);a.s(["ArrowLeft",0,b],673860)},373009,a=>{"use strict";let b=(0,a.i(221236).default)("CodeXml",[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]]);a.s(["Code2",0,b],373009)},102797,a=>{"use strict";let b=(0,a.i(221236).default)("Package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["path",{d:"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7",key:"yx3hmr"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);a.s(["Package",0,b],102797)},949210,a=>{"use strict";var b=a.i(527155),c=a.i(193806),d=a.i(673860),e=a.i(102797),f=a.i(373009),g=a.i(636243),h=a.i(456843),i=a.i(943917);a.s(["default",0,function(){return(0,b.jsx)("div",{className:"min-h-screen bg-background",children:(0,b.jsxs)("div",{className:"container mx-auto px-4 py-12 max-w-5xl",children:[(0,b.jsxs)(c.default,{href:"/developers",className:"inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8",children:[(0,b.jsx)(d.ArrowLeft,{className:"h-4 w-4"}),"Back to Developers"]}),(0,b.jsxs)("div",{className:"mb-12",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,b.jsx)("div",{className:"h-12 w-12 rounded-lg bg-[#00ADD8]/10 flex items-center justify-center",children:(0,b.jsx)(e.Package,{className:"h-6 w-6 text-[#00ADD8]"})}),(0,b.jsx)("h1",{className:"text-4xl font-bold",children:"Go SDK"})]}),(0,b.jsx)("p",{className:"text-xl text-muted-foreground",children:"Official Go library for the Taxu API. Built for performance and type safety."})]}),(0,b.jsxs)("section",{className:"mb-12",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Installation"}),(0,b.jsx)("div",{className:"bg-card border border-border rounded-lg p-6",children:(0,b.jsx)("pre",{className:"text-sm overflow-x-auto",children:(0,b.jsx)("code",{className:"text-foreground",children:"go get github.com/taxu/taxu-go"})})})]}),(0,b.jsxs)("section",{className:"mb-12",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Quick Start"}),(0,b.jsx)("div",{className:"bg-card border border-border rounded-lg p-6",children:(0,b.jsx)("pre",{className:"text-sm overflow-x-auto",children:(0,b.jsx)("code",{className:"text-foreground",children:`package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/taxu/taxu-go"
)

func main() {
    // Initialize client
    client := taxu.NewClient("your_api_key")
    
    // Create a tax return
    ctx := context.Background()
    taxReturn, err := client.TaxReturns.Create(ctx, &taxu.TaxReturnParams{
        Year:         2024,
        FilingStatus: "single",
        Income:       75000,
    })
    
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Tax Return ID: %s\\n", taxReturn.ID)
    fmt.Printf("Estimated Refund: $%.2f\\n", taxReturn.EstimatedRefund)
}`})})})]}),(0,b.jsxs)("section",{className:"mb-12",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-6",children:"Features"}),(0,b.jsxs)("div",{className:"grid md:grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{className:"bg-card border border-border rounded-lg p-6",children:[(0,b.jsx)(f.Code2,{className:"h-8 w-8 text-primary mb-3"}),(0,b.jsx)("h3",{className:"font-semibold mb-2",children:"Type-Safe"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Full type definitions with compile-time safety"})]}),(0,b.jsxs)("div",{className:"bg-card border border-border rounded-lg p-6",children:[(0,b.jsx)(g.Zap,{className:"h-8 w-8 text-primary mb-3"}),(0,b.jsx)("h3",{className:"font-semibold mb-2",children:"High Performance"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Optimized for speed with connection pooling"})]}),(0,b.jsxs)("div",{className:"bg-card border border-border rounded-lg p-6",children:[(0,b.jsx)(h.Shield,{className:"h-8 w-8 text-primary mb-3"}),(0,b.jsx)("h3",{className:"font-semibold mb-2",children:"Context Support"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Built-in context.Context for cancellation and timeouts"})]}),(0,b.jsxs)("div",{className:"bg-card border border-border rounded-lg p-6",children:[(0,b.jsx)(e.Package,{className:"h-8 w-8 text-primary mb-3"}),(0,b.jsx)("h3",{className:"font-semibold mb-2",children:"Idiomatic Go"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Follows Go best practices and conventions"})]})]})]}),(0,b.jsxs)("section",{className:"mb-12",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Advanced Usage"}),(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-lg font-semibold mb-3",children:"Calculate Refund Estimate"}),(0,b.jsx)("div",{className:"bg-card border border-border rounded-lg p-6",children:(0,b.jsx)("pre",{className:"text-sm overflow-x-auto",children:(0,b.jsx)("code",{className:"text-foreground",children:`estimate, err := client.Calculations.EstimateRefund(ctx, &taxu.RefundParams{
    Income:       85000,
    Deductions:   12000,
    Credits:      2000,
    FilingStatus: "married_joint",
})

if err != nil {
    log.Fatal(err)
}

fmt.Printf("Federal Refund: $%.2f\\n", estimate.FederalRefund)
fmt.Printf("State Refund: $%.2f\\n", estimate.StateRefund)
fmt.Printf("Confidence: %.1f%%\\n", estimate.Confidence*100)`})})})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-lg font-semibold mb-3",children:"Upload Tax Document"}),(0,b.jsx)("div",{className:"bg-card border border-border rounded-lg p-6",children:(0,b.jsx)("pre",{className:"text-sm overflow-x-auto",children:(0,b.jsx)("code",{className:"text-foreground",children:`file, err := os.Open("w2.pdf")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

doc, err := client.Documents.Upload(ctx, &taxu.DocumentParams{
    File:     file,
    Type:     "w2",
    TaxYear:  2024,
    UserID:   "user_123",
})

if err != nil {
    log.Fatal(err)
}

fmt.Printf("Document ID: %s\\n", doc.ID)
fmt.Printf("Status: %s\\n", doc.Status)`})})})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-lg font-semibold mb-3",children:"AI Tax Assistant"}),(0,b.jsx)("div",{className:"bg-card border border-border rounded-lg p-6",children:(0,b.jsx)("pre",{className:"text-sm overflow-x-auto",children:(0,b.jsx)("code",{className:"text-foreground",children:`response, err := client.AI.Chat(ctx, &taxu.ChatParams{
    Message:  "Can I deduct home office expenses?",
    Agent:    "sophie",
    Context: map[string]interface{}{
        "filing_status": "single",
        "has_w2":        true,
    },
})

if err != nil {
    log.Fatal(err)
}

fmt.Println(response.Message)
// Output: "Yes! As a W-2 employee working from home..."`})})})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-lg font-semibold mb-3",children:"Verify Webhook Signatures"}),(0,b.jsx)("div",{className:"bg-card border border-border rounded-lg p-6",children:(0,b.jsx)("pre",{className:"text-sm overflow-x-auto",children:(0,b.jsx)("code",{className:"text-foreground",children:`func handleWebhook(w http.ResponseWriter, r *http.Request) {
    payload, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Error reading body", 400)
        return
    }
    
    signature := r.Header.Get("X-Taxu-Signature")
    
    event, err := taxu.VerifyWebhook(payload, signature, webhookSecret)
    if err != nil {
        http.Error(w, "Invalid signature", 401)
        return
    }
    
    switch event.Type {
    case "return.completed":
        handleReturnCompleted(event.Data)
    case "refund.issued":
        handleRefundIssued(event.Data)
    }
    
    w.WriteHeader(200)
}`})})})]})]})]}),(0,b.jsxs)("section",{className:"mb-12",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Error Handling"}),(0,b.jsx)("div",{className:"bg-card border border-border rounded-lg p-6",children:(0,b.jsx)("pre",{className:"text-sm overflow-x-auto",children:(0,b.jsx)("code",{className:"text-foreground",children:`taxReturn, err := client.TaxReturns.Get(ctx, "return_123")
if err != nil {
    if taxuErr, ok := err.(*taxu.Error); ok {
        switch taxuErr.Code {
        case "not_found":
            fmt.Println("Tax return not found")
        case "rate_limit":
            fmt.Println("Rate limit exceeded")
        case "invalid_request":
            fmt.Printf("Invalid request: %s\\n", taxuErr.Message)
        default:
            fmt.Printf("API error: %s\\n", taxuErr.Message)
        }
    } else {
        log.Fatal(err)
    }
}`})})})]}),(0,b.jsxs)("section",{className:"mb-12",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Configuration"}),(0,b.jsx)("div",{className:"bg-card border border-border rounded-lg p-6",children:(0,b.jsx)("pre",{className:"text-sm overflow-x-auto",children:(0,b.jsx)("code",{className:"text-foreground",children:`// Custom configuration
client := taxu.NewClient(
    "your_api_key",
    taxu.WithBaseURL("https://api.taxu.ai/v1"),
    taxu.WithTimeout(30*time.Second),
    taxu.WithRetries(3),
    taxu.WithHTTPClient(&http.Client{
        Transport: &http.Transport{
            MaxIdleConns:    10,
            IdleConnTimeout: 90 * time.Second,
        },
    }),
)`})})})]}),(0,b.jsxs)("section",{className:"mb-12",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Resources"}),(0,b.jsxs)("div",{className:"grid md:grid-cols-2 gap-4",children:[(0,b.jsxs)(c.default,{href:"https://github.com/taxu/taxu-go",className:"bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors",children:[(0,b.jsx)("h3",{className:"font-semibold mb-2",children:"GitHub Repository"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"View source code and contribute"})]}),(0,b.jsxs)(c.default,{href:"/api-docs",className:"bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors",children:[(0,b.jsx)("h3",{className:"font-semibold mb-2",children:"API Reference"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Complete API documentation"})]}),(0,b.jsxs)(c.default,{href:"https://pkg.go.dev/github.com/taxu/taxu-go",className:"bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors",children:[(0,b.jsx)("h3",{className:"font-semibold mb-2",children:"Go Package Docs"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Full package documentation"})]}),(0,b.jsxs)(c.default,{href:"/sandbox",className:"bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors",children:[(0,b.jsx)("h3",{className:"font-semibold mb-2",children:"Try in Sandbox"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Test API calls safely"})]})]})]}),(0,b.jsxs)("div",{className:"bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 text-center",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Ready to Build?"}),(0,b.jsx)("p",{className:"text-muted-foreground mb-6",children:"Get your API key and start integrating Taxu into your Go application"}),(0,b.jsxs)("div",{className:"flex gap-4 justify-center",children:[(0,b.jsx)(i.Button,{asChild:!0,size:"lg",children:(0,b.jsx)(c.default,{href:"/developer-portal",children:"Get API Key"})}),(0,b.jsx)(i.Button,{asChild:!0,variant:"outline",size:"lg",children:(0,b.jsx)(c.default,{href:"/api-docs",children:"View API Docs"})})]})]})]})})}])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__b408cf3a._.js.map