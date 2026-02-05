module.exports=[193695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},679659,a=>{a.n(a.i(526807))},825907,a=>{a.n(a.i(755716))},93079,a=>{a.n(a.i(267738))},623392,a=>{a.n(a.i(159229))},622202,a=>{a.n(a.i(912483))},386183,a=>{a.n(a.i(834095))},907167,a=>{"use strict";var b=a.i(184112);let c=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim();var d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let e=(0,b.forwardRef)(({color:a="currentColor",size:e=24,strokeWidth:f=2,absoluteStrokeWidth:g,className:h="",children:i,iconNode:j,...k},l)=>(0,b.createElement)("svg",{ref:l,...d,width:e,height:e,stroke:a,strokeWidth:g?24*Number(f)/Number(e):f,className:c("lucide",h),...k},[...j.map(([a,c])=>(0,b.createElement)(a,c)),...Array.isArray(i)?i:[i]]));a.s(["default",0,(a,d)=>{let f=(0,b.forwardRef)(({className:f,...g},h)=>(0,b.createElement)(e,{ref:h,iconNode:d,className:c(`lucide-${a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,f),...g}));return f.displayName=`${a}`,f}],907167)},55213,(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}c._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}},202014,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(835623);a.n(d("[project]/taxu-platform/v0-taxu-landing-page/node_modules/next/dist/client/app-dir/link.js <module evaluation>"))},708384,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(835623);a.n(d("[project]/taxu-platform/v0-taxu-landing-page/node_modules/next/dist/client/app-dir/link.js"))},54882,a=>{"use strict";a.i(202014);var b=a.i(708384);a.n(b)},121634,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={default:function(){return i},useLinkStatus:function(){return h.useLinkStatus}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(55213),g=a.r(595459),h=f._(a.r(54882));function i(a){let b=a.legacyBehavior,c="string"==typeof a.children||"number"==typeof a.children||"string"==typeof a.children?.type,d=a.children?.type?.$$typeof===Symbol.for("react.client.reference");return!b||c||d||(a.children?.type?.$$typeof===Symbol.for("react.lazy")?console.error("Using a Lazy Component as a direct child of `<Link legacyBehavior>` from a Server Component is not supported. If you need legacyBehavior, wrap your Lazy Component in a Client Component that renders the Link's `<a>` tag."):console.error("Using a Server Component as a direct child of `<Link legacyBehavior>` is not supported. If you need legacyBehavior, wrap your Server Component in a Client Component that renders the Link's `<a>` tag.")),(0,g.jsx)(h.default,{...a})}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},627058,892260,a=>{"use strict";let b,c,d;var e=a.i(184112);function f(a,b){if("function"==typeof a)return a(b);null!=a&&(a.current=b)}var g=a.i(595459),h=Symbol.for("react.lazy"),i=e[" use ".trim().toString()];function j(a){var b;return null!=a&&"object"==typeof a&&"$$typeof"in a&&a.$$typeof===h&&"_payload"in a&&"object"==typeof(b=a._payload)&&null!==b&&"then"in b}var k=((d=e.forwardRef((a,b)=>{let{children:c,...d}=a;if(j(c)&&"function"==typeof i&&(c=i(c._payload)),e.isValidElement(c)){var g;let a,h,i=(g=c,(h=(a=Object.getOwnPropertyDescriptor(g.props,"ref")?.get)&&"isReactWarning"in a&&a.isReactWarning)?g.ref:(h=(a=Object.getOwnPropertyDescriptor(g,"ref")?.get)&&"isReactWarning"in a&&a.isReactWarning)?g.props.ref:g.props.ref||g.ref),j=function(a,b){let c={...b};for(let d in b){let e=a[d],f=b[d];/^on[A-Z]/.test(d)?e&&f?c[d]=(...a)=>{let b=f(...a);return e(...a),b}:e&&(c[d]=e):"style"===d?c[d]={...e,...f}:"className"===d&&(c[d]=[e,f].filter(Boolean).join(" "))}return{...a,...c}}(d,c.props);return c.type!==e.Fragment&&(j.ref=b?function(...a){return b=>{let c=!1,d=a.map(a=>{let d=f(a,b);return c||"function"!=typeof d||(c=!0),d});if(c)return()=>{for(let b=0;b<d.length;b++){let c=d[b];"function"==typeof c?c():f(a[b],null)}}}}(b,i):i),e.cloneElement(c,j)}return e.Children.count(c)>1?e.Children.only(null):null})).displayName="Slot.SlotClone",b=d,(c=e.forwardRef((a,c)=>{let{children:d,...f}=a;j(d)&&"function"==typeof i&&(d=i(d._payload));let h=e.Children.toArray(d),k=h.find(m);if(k){let a=k.props.children,d=h.map(b=>b!==k?b:e.Children.count(a)>1?e.Children.only(null):e.isValidElement(a)?a.props.children:null);return(0,g.jsx)(b,{...f,ref:c,children:e.isValidElement(a)?e.cloneElement(a,void 0,d):null})}return(0,g.jsx)(b,{...f,ref:c,children:d})})).displayName="Slot.Slot",c),l=Symbol("radix.slottable");function m(a){return e.isValidElement(a)&&"function"==typeof a.type&&"__radixId"in a.type&&a.type.__radixId===l}a.s(["Slot",0,k],627058);var n=a.i(600001);let o=a=>"boolean"==typeof a?`${a}`:0===a?"0":a,p=n.clsx;a.s(["cva",0,(a,b)=>c=>{var d;if((null==b?void 0:b.variants)==null)return p(a,null==c?void 0:c.class,null==c?void 0:c.className);let{variants:e,defaultVariants:f}=b,g=Object.keys(e).map(a=>{let b=null==c?void 0:c[a],d=null==f?void 0:f[a];if(null===b)return null;let g=o(b)||o(d);return e[a][g]}),h=c&&Object.entries(c).reduce((a,b)=>{let[c,d]=b;return void 0===d||(a[c]=d),a},{});return p(a,g,null==b||null==(d=b.compoundVariants)?void 0:d.reduce((a,b)=>{let{class:c,className:d,...e}=b;return Object.entries(e).every(a=>{let[b,c]=a;return Array.isArray(c)?c.includes({...f,...h}[b]):({...f,...h})[b]===c})?[...a,c,d]:a},[]),null==c?void 0:c.class,null==c?void 0:c.className)}],892260)},736668,a=>{"use strict";var b=a.i(595459),c=a.i(627058),d=a.i(892260),e=a.i(939701);let f=(0,d.cva)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-sm hover:shadow-md active:shadow-none active:translate-y-[1px]",{variants:{variant:{default:"bg-[#635bff] text-white hover:bg-[#635bff]/90 hover:shadow-lg",destructive:"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-[#0a2540] text-white hover:bg-[#0a2540]/90",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 shadow-none hover:shadow-none",link:"text-[#635bff] underline-offset-4 hover:underline shadow-none hover:shadow-none"},size:{default:"h-10 px-5 py-2 has-[>svg]:px-4",sm:"h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",lg:"h-12 rounded-full px-8 has-[>svg]:px-6 text-base",icon:"size-10 rounded-full","icon-sm":"size-8 rounded-full","icon-lg":"size-12 rounded-full"}},defaultVariants:{variant:"default",size:"default"}});a.s(["Button",0,function({className:a,variant:d,size:g,asChild:h=!1,...i}){let j=h?c.Slot:"button";return(0,b.jsx)(j,{"data-slot":"button",className:(0,e.cn)(f({variant:d,size:g,className:a})),...i})}])},308514,a=>{"use strict";let b=(0,a.i(907167).default)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);a.s(["ArrowLeft",0,b],308514)},449597,a=>{"use strict";var b=a.i(595459),c=a.i(121634),d=a.i(308514),e=a.i(736668);let f={"earned-income-tax-credit":{title:"Understanding the Earned Income Tax Credit (EITC)",category:"Tax Credits",readTime:"5 min read",date:"Jan 15, 2025",content:`
      <h2>What is the Earned Income Tax Credit?</h2>
      <p>The Earned Income Tax Credit (EITC) is one of the most valuable tax credits available to working Americans. It's designed to help low to moderate-income workers and families reduce their tax burden and potentially receive a substantial refund.</p>
      
      <h2>Who Qualifies for EITC?</h2>
      <p>To qualify for the EITC, you must meet certain requirements:</p>
      <ul>
        <li>Have earned income from employment or self-employment</li>
        <li>Meet income limits based on filing status and number of children</li>
        <li>Have a valid Social Security number</li>
        <li>Be a U.S. citizen or resident alien all year</li>
      </ul>
      
      <h2>How Much Can You Get?</h2>
      <p>The EITC amount varies based on your income, filing status, and number of qualifying children. For 2025, the maximum credit amounts are:</p>
      <ul>
        <li>No children: Up to $600</li>
        <li>One child: Up to $3,995</li>
        <li>Two children: Up to $6,604</li>
        <li>Three or more children: Up to $7,430</li>
      </ul>
      
      <h2>How Taxu Can Help</h2>
      <p>Taxu's AI-powered platform automatically determines your EITC eligibility and calculates the maximum credit you're entitled to. Our intelligent system ensures you don't miss out on thousands of dollars in potential refunds.</p>
    `},"freelancer-quarterly-taxes":{title:"Freelancer's Guide to Quarterly Taxes",category:"Self-Employment",readTime:"8 min read",date:"Jan 12, 2025",content:`
      <h2>Understanding Quarterly Tax Payments</h2>
      <p>As a freelancer or self-employed individual, you're responsible for paying taxes throughout the year through quarterly estimated tax payments. This guide will help you navigate this important obligation.</p>
      
      <h2>Who Needs to Pay Quarterly Taxes?</h2>
      <p>You generally need to make quarterly tax payments if you expect to owe at least $1,000 in taxes when you file your return. This typically applies to:</p>
      <ul>
        <li>Freelancers and independent contractors</li>
        <li>Small business owners</li>
        <li>Anyone with significant income not subject to withholding</li>
      </ul>
      
      <h2>When Are Quarterly Taxes Due?</h2>
      <p>Quarterly tax payments are due four times a year:</p>
      <ul>
        <li>Q1: April 15</li>
        <li>Q2: June 15</li>
        <li>Q3: September 15</li>
        <li>Q4: January 15 (following year)</li>
      </ul>
      
      <h2>How to Calculate Your Quarterly Payments</h2>
      <p>Taxu's AI agents automatically calculate your quarterly tax obligations based on your income, deductions, and tax situation. We'll send you reminders before each deadline and help you avoid penalties.</p>
    `},"ai-revolutionizing-tax-filing":{title:"How AI is Revolutionizing Tax Filing",category:"Technology",readTime:"6 min read",date:"Jan 10, 2025",content:`
      <h2>The Future of Tax Filing is Here</h2>
      <p>Artificial intelligence is transforming the way we approach tax filing, making it faster, more accurate, and less stressful than ever before.</p>
      
      <h2>AI-Powered Deduction Discovery</h2>
      <p>Traditional tax software requires you to manually search for deductions. Taxu's AI agents automatically scan your financial data to identify every deduction you're eligible for, ensuring you never leave money on the table.</p>
      
      <h2>Intelligent Error Detection</h2>
      <p>Our AI continuously monitors your return for potential errors, inconsistencies, or red flags that could trigger an audit. It's like having a team of expert tax professionals reviewing your return 24/7.</p>
      
      <h2>Natural Language Processing</h2>
      <p>Ask questions in plain English and get instant, accurate answers. No more searching through tax code or waiting on hold for customer support.</p>
      
      <h2>Predictive Tax Planning</h2>
      <p>Taxu's AI doesn't just help you file taxes—it helps you plan for the future. Get personalized recommendations on how to optimize your tax strategy throughout the year.</p>
    `},"top-10-tax-deductions":{title:"Top 10 Tax Deductions You're Probably Missing",category:"Deductions",readTime:"7 min read",date:"Jan 8, 2025",content:`
      <h2>Don't Leave Money on the Table</h2>
      <p>Many taxpayers miss out on valuable deductions simply because they don't know they exist. Here are the top 10 commonly overlooked deductions that could save you hundreds or even thousands of dollars.</p>
      
      <h2>1. Home Office Deduction</h2>
      <p>If you work from home, you may be able to deduct a portion of your rent, utilities, and other home expenses.</p>
      
      <h2>2. State Sales Tax</h2>
      <p>You can choose to deduct either state income tax or state sales tax—whichever is higher.</p>
      
      <h2>3. Charitable Contributions</h2>
      <p>Don't forget to deduct donations to qualified charities, including non-cash contributions like clothing and household items.</p>
      
      <h2>4. Student Loan Interest</h2>
      <p>You can deduct up to $2,500 in student loan interest, even if you don't itemize.</p>
      
      <h2>5. Medical Expenses</h2>
      <p>If your medical expenses exceed 7.5% of your adjusted gross income, you can deduct the excess.</p>
      
      <h2>How Taxu Finds Every Deduction</h2>
      <p>Taxu's AI agents automatically identify all deductions you're eligible for by analyzing your financial data and asking smart questions. We ensure you claim every dollar you deserve.</p>
    `},"what-triggers-irs-audit":{title:"What Triggers an IRS Audit?",category:"Compliance",readTime:"10 min read",date:"Jan 5, 2025",content:`
      <h2>Understanding IRS Audits</h2>
      <p>While the chances of being audited are relatively low, certain red flags can increase your risk. Understanding what triggers an audit can help you avoid unwanted attention from the IRS.</p>
      
      <h2>Common Audit Triggers</h2>
      
      <h3>1. High Income</h3>
      <p>The more you earn, the higher your audit risk. Taxpayers earning over $200,000 are audited at significantly higher rates.</p>
      
      <h3>2. Unreported Income</h3>
      <p>The IRS receives copies of all your 1099s and W-2s. If your reported income doesn't match their records, expect a letter.</p>
      
      <h3>3. Excessive Deductions</h3>
      <p>Claiming deductions that are disproportionately large compared to your income can raise red flags.</p>
      
      <h3>4. Home Office Deduction</h3>
      <p>While legitimate, this deduction is often scrutinized. Make sure you meet all requirements.</p>
      
      <h3>5. Cash-Heavy Business</h3>
      <p>Businesses that deal primarily in cash face higher audit rates due to the potential for unreported income.</p>
      
      <h2>How Taxu Protects You</h2>
      <p>Taxu's AI continuously monitors your return for potential audit triggers and provides guidance on how to properly document your deductions. We help you stay compliant while maximizing your refund.</p>
    `},"llc-vs-s-corp":{title:"LLC vs S-Corp: Which is Right for Your Business?",category:"Business",readTime:"12 min read",date:"Jan 3, 2025",content:`
      <h2>Choosing the Right Business Structure</h2>
      <p>One of the most important decisions you'll make as a business owner is choosing the right legal structure. LLCs and S-Corps are two popular options, each with distinct tax implications.</p>
      
      <h2>What is an LLC?</h2>
      <p>A Limited Liability Company (LLC) is a flexible business structure that provides personal liability protection while allowing profits and losses to pass through to your personal tax return.</p>
      
      <h3>LLC Advantages:</h3>
      <ul>
        <li>Simple to set up and maintain</li>
        <li>Flexible management structure</li>
        <li>Pass-through taxation</li>
        <li>Personal liability protection</li>
      </ul>
      
      <h2>What is an S-Corp?</h2>
      <p>An S-Corporation is a tax election that allows your business to avoid double taxation while potentially reducing self-employment taxes.</p>
      
      <h3>S-Corp Advantages:</h3>
      <ul>
        <li>Potential self-employment tax savings</li>
        <li>Pass-through taxation</li>
        <li>Enhanced credibility</li>
        <li>Easier to transfer ownership</li>
      </ul>
      
      <h2>Which Should You Choose?</h2>
      <p>The right choice depends on your specific situation, including your income level, business type, and long-term goals. Generally, S-Corps become more beneficial when your business income exceeds $60,000-$80,000 annually.</p>
      
      <h2>Let Taxu Help You Decide</h2>
      <p>Taxu's AI agents can analyze your business situation and provide personalized recommendations on the best structure for your needs. We'll help you understand the tax implications and make an informed decision.</p>
    `}};async function g({params:a}){let g=f[(await a).slug];return g?(0,b.jsx)("div",{className:"min-h-screen bg-background pt-20",children:(0,b.jsx)("article",{className:"py-20 px-4",children:(0,b.jsxs)("div",{className:"container mx-auto max-w-3xl",children:[(0,b.jsxs)(c.default,{href:"/blog",className:"inline-flex items-center gap-2 text-neon hover:underline mb-8",children:[(0,b.jsx)(d.ArrowLeft,{className:"w-4 h-4"}),"Back to Blog"]}),(0,b.jsxs)("div",{className:"mb-12",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,b.jsx)("span",{className:"text-sm font-semibold text-neon",children:g.category}),(0,b.jsx)("span",{className:"text-sm text-muted-foreground",children:"•"}),(0,b.jsx)("span",{className:"text-sm text-muted-foreground",children:g.readTime}),(0,b.jsx)("span",{className:"text-sm text-muted-foreground",children:"•"}),(0,b.jsx)("span",{className:"text-sm text-muted-foreground",children:g.date})]}),(0,b.jsx)("h1",{className:"text-4xl md:text-5xl font-bold mb-6",children:g.title})]}),(0,b.jsx)("div",{className:"prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-neon prose-strong:text-foreground prose-ul:text-muted-foreground",dangerouslySetInnerHTML:{__html:g.content}}),(0,b.jsxs)("div",{className:"mt-16 p-8 rounded-xl border border-neon/20 bg-card/50 backdrop-blur text-center",children:[(0,b.jsx)("h3",{className:"text-2xl font-bold mb-4",children:"Ready to Simplify Your Taxes?"}),(0,b.jsx)("p",{className:"text-muted-foreground mb-6",children:"Let Taxu's AI agents handle the complexity while you focus on what matters."}),(0,b.jsx)(c.default,{href:"/get-started",children:(0,b.jsx)(e.Button,{size:"lg",className:"bg-neon text-background hover:bg-neon/90",children:"Get Started Free"})})]})]})})}):(0,b.jsx)("div",{className:"min-h-screen bg-background pt-20 flex items-center justify-center",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("h1",{className:"text-4xl font-bold mb-4",children:"Article Not Found"}),(0,b.jsx)(c.default,{href:"/blog",children:(0,b.jsx)(e.Button,{children:"Back to Blog"})})]})})}a.s(["default",0,g])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__5561fdd0._.js.map