module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},644913,(e,t,r)=>{"use strict";t.exports=e.r(918622)},558553,(e,t,r)=>{"use strict";t.exports=e.r(644913).vendored["react-rsc"].React},976281,(e,t,r)=>{"use strict";var a=Object.defineProperty,i=Object.getOwnPropertyDescriptor,n=Object.getOwnPropertyNames,s=Object.prototype.hasOwnProperty,o={},l={RequestCookies:()=>h,ResponseCookies:()=>f,parseCookie:()=>d,parseSetCookie:()=>p,stringifyCookie:()=>u};for(var c in l)a(o,c,{get:l[c],enumerable:!0});function u(e){var t;let r=["path"in e&&e.path&&`Path=${e.path}`,"expires"in e&&(e.expires||0===e.expires)&&`Expires=${("number"==typeof e.expires?new Date(e.expires):e.expires).toUTCString()}`,"maxAge"in e&&"number"==typeof e.maxAge&&`Max-Age=${e.maxAge}`,"domain"in e&&e.domain&&`Domain=${e.domain}`,"secure"in e&&e.secure&&"Secure","httpOnly"in e&&e.httpOnly&&"HttpOnly","sameSite"in e&&e.sameSite&&`SameSite=${e.sameSite}`,"partitioned"in e&&e.partitioned&&"Partitioned","priority"in e&&e.priority&&`Priority=${e.priority}`].filter(Boolean),a=`${e.name}=${encodeURIComponent(null!=(t=e.value)?t:"")}`;return 0===r.length?a:`${a}; ${r.join("; ")}`}function d(e){let t=new Map;for(let r of e.split(/; */)){if(!r)continue;let e=r.indexOf("=");if(-1===e){t.set(r,"true");continue}let[a,i]=[r.slice(0,e),r.slice(e+1)];try{t.set(a,decodeURIComponent(null!=i?i:"true"))}catch{}}return t}function p(e){if(!e)return;let[[t,r],...a]=d(e),{domain:i,expires:n,httponly:s,maxage:o,path:l,samesite:c,secure:u,partitioned:p,priority:h}=Object.fromEntries(a.map(([e,t])=>[e.toLowerCase().replace(/-/g,""),t]));{var f,y,_={name:t,value:decodeURIComponent(r),domain:i,...n&&{expires:new Date(n)},...s&&{httpOnly:!0},..."string"==typeof o&&{maxAge:Number(o)},path:l,...c&&{sameSite:m.includes(f=(f=c).toLowerCase())?f:void 0},...u&&{secure:!0},...h&&{priority:g.includes(y=(y=h).toLowerCase())?y:void 0},...p&&{partitioned:!0}};let e={};for(let t in _)_[t]&&(e[t]=_[t]);return e}}t.exports=((e,t,r,o)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let r of n(t))s.call(e,r)||void 0===r||a(e,r,{get:()=>t[r],enumerable:!(o=i(t,r))||o.enumerable});return e})(a({},"__esModule",{value:!0}),o);var m=["strict","lax","none"],g=["low","medium","high"],h=class{constructor(e){this._parsed=new Map,this._headers=e;const t=e.get("cookie");if(t)for(const[e,r]of d(t))this._parsed.set(e,{name:e,value:r})}[Symbol.iterator](){return this._parsed[Symbol.iterator]()}get size(){return this._parsed.size}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed);if(!e.length)return r.map(([e,t])=>t);let a="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(([e])=>e===a).map(([e,t])=>t)}has(e){return this._parsed.has(e)}set(...e){let[t,r]=1===e.length?[e[0].name,e[0].value]:e,a=this._parsed;return a.set(t,{name:t,value:r}),this._headers.set("cookie",Array.from(a).map(([e,t])=>u(t)).join("; ")),this}delete(e){let t=this._parsed,r=Array.isArray(e)?e.map(e=>t.delete(e)):t.delete(e);return this._headers.set("cookie",Array.from(t).map(([e,t])=>u(t)).join("; ")),r}clear(){return this.delete(Array.from(this._parsed.keys())),this}[Symbol.for("edge-runtime.inspect.custom")](){return`RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(e=>`${e.name}=${encodeURIComponent(e.value)}`).join("; ")}},f=class{constructor(e){var t,r,a;this._parsed=new Map,this._headers=e;const i=null!=(a=null!=(r=null==(t=e.getSetCookie)?void 0:t.call(e))?r:e.get("set-cookie"))?a:[];for(const e of Array.isArray(i)?i:function(e){if(!e)return[];var t,r,a,i,n,s=[],o=0;function l(){for(;o<e.length&&/\s/.test(e.charAt(o));)o+=1;return o<e.length}for(;o<e.length;){for(t=o,n=!1;l();)if(","===(r=e.charAt(o))){for(a=o,o+=1,l(),i=o;o<e.length&&"="!==(r=e.charAt(o))&&";"!==r&&","!==r;)o+=1;o<e.length&&"="===e.charAt(o)?(n=!0,o=i,s.push(e.substring(t,a)),t=o):o=a+1}else o+=1;(!n||o>=e.length)&&s.push(e.substring(t,e.length))}return s}(i)){const t=p(e);t&&this._parsed.set(t.name,t)}}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed.values());if(!e.length)return r;let a="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(e=>e.name===a)}has(e){return this._parsed.has(e)}set(...e){let[t,r,a]=1===e.length?[e[0].name,e[0].value,e[0]]:e,i=this._parsed;return i.set(t,function(e={name:"",value:""}){return"number"==typeof e.expires&&(e.expires=new Date(e.expires)),e.maxAge&&(e.expires=new Date(Date.now()+1e3*e.maxAge)),(null===e.path||void 0===e.path)&&(e.path="/"),e}({name:t,value:r,...a})),function(e,t){for(let[,r]of(t.delete("set-cookie"),e)){let e=u(r);t.append("set-cookie",e)}}(i,this._headers),this}delete(...e){let[t,r]="string"==typeof e[0]?[e[0]]:[e[0].name,e[0]];return this.set({...r,name:t,value:"",expires:new Date(0)})}[Symbol.for("edge-runtime.inspect.custom")](){return`ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(u).join("; ")}}},110043,e=>{"use strict";e.i(392229);var t=e.i(929094),r=e.i(295986);async function a(){let e=await (0,r.cookies)();return(0,t.createServerClient)("https://auth.taxu.io","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbXBpeXppZXFhbHVzcHN6bnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMDg2MzksImV4cCI6MjA3NTg4NDYzOX0.jlyovoe8I1_BV0i1BexuJ_2MfhGDkQGYyqx9ri97UGQ",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:r,options:a})=>e.set(t,r,a))}catch{}}}})}async function i(){return a()}async function n(){try{return await a()}catch(e){return console.error("[v0] Failed to create Supabase client:",e),null}}e.s(["createClient",0,a,"createClientSafe",0,n,"getSupabaseServerClient",0,i])},883051,(e,t,r)=>{"use strict";var a=Object.defineProperty,i=Object.getOwnPropertyDescriptor,n=Object.getOwnPropertyNames,s=Object.prototype.hasOwnProperty,o={},l={VercelOidcTokenError:()=>u};for(var c in l)a(o,c,{get:l[c],enumerable:!0});t.exports=((e,t,r,o)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let r of n(t))s.call(e,r)||void 0===r||a(e,r,{get:()=>t[r],enumerable:!(o=i(t,r))||o.enumerable});return e})(a({},"__esModule",{value:!0}),o);class u extends Error{constructor(e,t){super(e),this.name="VercelOidcTokenError",this.cause=t}toString(){return this.cause?`${this.name}: ${this.message}: ${this.cause}`:`${this.name}: ${this.message}`}}},611263,e=>{"use strict";var t=e.i(70996),r=e.i(419142);let a={Sam:{name:"Sam",role:"Lead Tax Strategist",personality:"Calm, intelligent, authoritative. Acts as the central brain, coordinating other agents and seeing the big picture.",expertise:["Tax strategy","Risk management","Deduction optimization","IRS compliance"],communication_style:"Professional, clear, and structured",decision_making:"Holistic and strategic"},Sophie:{name:"Sophie",role:"Filing Assistant",personality:"Friendly, patient, organized. Focuses on helping the user complete tasks and feel supported.",expertise:["Tax forms","Document requirements","Filing checklists","Progress tracking"],communication_style:"Warm, encouraging, and simple",decision_making:"Process-oriented and helpful"},Miles:{name:"Miles",role:"Audit Risk Monitor",personality:"Analytical, cautious, alert. Constantly scanning for risks and anomalies.",expertise:["Audit prevention","Risk analysis","IRS compliance","Pattern recognition"],communication_style:"Direct, serious, and precise",decision_making:"Risk-averse and protective"},Nia:{name:"Nia",role:"Document Intelligence Agent",personality:"Efficient, fast, sharp. Obsessed with data accuracy and extraction speed.",expertise:["OCR processing","Data extraction","Form recognition","Field validation"],communication_style:"Brief, factual, and data-centric",decision_making:"Data-driven and binary (valid/invalid)"},Remy:{name:"Remy",role:"Smart Reminder Agent",personality:"Helpful, timely, upbeat. Focused on keeping the user on schedule.",expertise:["Deadline management","Task scheduling","Progress tracking","Notification timing"],communication_style:"Cheerful, urgent (when needed), and clear",decision_making:"Time-sensitive and action-oriented"},Lex:{name:"Lex",role:"Legal & Compliance Watchdog",personality:"Precise, serious, protective. The final check for legality and compliance.",expertise:["Tax law","IRS regulations","Legal compliance","Disclaimer management"],communication_style:"Formal, cited, and authoritative",decision_making:"Compliance-driven and rigid"}};e.s(["AGENT_PERSONALITIES",0,a,"AgentCollaboration",0,class{supabase;userId;constructor(e,t){this.supabase=e,this.userId=t}async initiateCollaboration(e,i,n,s){console.log(`[Collaboration] Initiating ${e} with agents:`,i.join(", "));let o=i.map(e=>{let t=a[e];return`${t.name} (${t.role}): ${t.personality}`}),l=`You are facilitating a collaboration between multiple AI tax agents. Each agent has unique expertise and personality.

Participating Agents:
${o.join("\n")}

Collaboration Type: ${e}
Trigger Event: ${n}
Context: ${JSON.stringify(s,null,2)}

Simulate a brief but insightful discussion between these agents. Each agent should:
1. Contribute their unique perspective based on their expertise
2. Build on others' insights
3. Identify potential conflicts or risks
4. Reach a consensus recommendation

Return a JSON object with:
{
  "discussion_summary": "Brief summary of the key points discussed",
  "consensus_reached": true/false,
  "recommendations": [
    {
      "agent": "agent_name",
      "recommendation": "specific recommendation",
      "reasoning": "why this is recommended",
      "priority": "high/medium/low"
    }
  ],
  "impact_score": 0-100,
  "next_steps": ["action 1", "action 2"]
}

Make the discussion realistic, insightful, and actionable.`;try{let{object:a}=await (0,t.generateObject)({model:"openai/gpt-4o",schema:r.z.object({discussion_summary:r.z.string(),consensus_reached:r.z.boolean(),recommendations:r.z.array(r.z.object({agent:r.z.string(),recommendation:r.z.string(),reasoning:r.z.string(),priority:r.z.enum(["high","medium","low"])})),impact_score:r.z.number().min(0).max(100),next_steps:r.z.array(r.z.string())}),prompt:l}),{data:s,error:o}=await this.supabase.from("agent_collaborations").insert({user_id:this.userId,collaboration_type:e,participating_agents:i,trigger_event:n,discussion_summary:a.discussion_summary,consensus_reached:a.consensus_reached,recommendations:a.recommendations,impact_score:a.impact_score,completed_at:new Date().toISOString()}).select().single();return{success:!0,collaboration:s,result:a}}catch(e){return console.error("[Collaboration] Error:",e),{success:!1,error:e}}}},"AgentMemory",0,class{supabase;userId;agentName;constructor(e,t,r){this.supabase=e,this.userId=t,this.agentName=r}async remember(e,t,r=[]){let{data:a,error:i}=await this.supabase.from("agent_memory").insert({user_id:this.userId,agent_name:this.agentName,memory_type:e,memory_content:t,tags:r,confidence_score:100,relevance_score:100}).select().single();return i?(console.error(`[${this.agentName}] Error storing memory:`,i),null):a}async recall(e,t,r=10){let a=this.supabase.from("agent_memory").select("*").eq("user_id",this.userId).eq("agent_name",this.agentName).order("relevance_score",{ascending:!1}).order("last_accessed_at",{ascending:!1}).limit(r);e&&(a=a.eq("memory_type",e)),t&&t.length>0&&(a=a.contains("tags",t));let{data:i,error:n}=await a;if(n)return console.error(`[${this.agentName}] Error recalling memory:`,n),[];if(i&&i.length>0){let e=i.map(e=>e.id);await this.supabase.from("agent_memory").update({last_accessed_at:new Date().toISOString(),access_count:this.supabase.rpc("increment",{row_id:e})}).in("id",e)}return i||[]}async learn(e,t,r){await this.supabase.from("agent_learning_events").insert({user_id:this.userId,agent_name:this.agentName,learning_type:e,context:t,lesson_learned:r,confidence_before:70,confidence_after:90,applied_to_future:!0})}},"InsightGenerator",0,class{supabase;userId;constructor(e,t){this.supabase=e,this.userId=t}async generateInsights(e){console.log("[Insights] Generating intelligent insights...");let r=`You are an advanced AI tax intelligence system analyzing a user's complete tax situation.

Context:
${JSON.stringify(e,null,2)}

Generate 3-5 intelligent insights that go beyond basic analysis. Look for:
1. Hidden opportunities the user might not know about
2. Potential risks or red flags
3. Trends or patterns in their tax situation
4. Predictions about future tax implications
5. Anomalies that need attention

Return a JSON array of insights:
[
  {
    "insight_type": "opportunity|risk|trend|anomaly|prediction",
    "title": "Brief, compelling title",
    "description": "Detailed explanation of the insight",
    "supporting_data": {"key": "value"},
    "confidence_level": 0-100,
    "impact_level": "low|medium|high|critical",
    "actionable": true/false,
    "suggested_actions": ["action 1", "action 2"],
    "generated_by": "agent_name"
  }
]

Be specific, actionable, and insightful. These insights should make the user say "Wow, I didn't know that!"`;try{let{text:e}=await (0,t.generateText)({model:"openai/gpt-4o",prompt:r,maxTokens:2e3}),a=e.trim();a.startsWith("```")&&(a=(a=(a=a.replace(/^```(?:json)?\n?/,"")).replace(/\n?```$/,"")).trim());let i=JSON.parse(a);for(let e of i)await this.supabase.from("intelligent_insights").insert({user_id:this.userId,...e});return i}catch(e){return console.error("[Insights] Error generating insights:",e),[]}}},"PredictiveTaxModel",0,class{supabase;userId;constructor(e,t){this.supabase=e,this.userId=t}async predictRefund(e,r){console.log("[Prediction] Generating refund prediction model...");let a=`You are a predictive AI model analyzing tax data to forecast future refunds.

Historical Data:
${JSON.stringify(e,null,2)}

Current Data:
${JSON.stringify(r,null,2)}

Generate a sophisticated prediction model that considers:
1. Historical trends
2. Income changes
3. Deduction patterns
4. Tax law changes
5. Life events
6. Economic factors

Return a JSON object:
{
  "predicted_refund": 0.00,
  "confidence_interval": {
    "low": 0.00,
    "high": 0.00,
    "confidence_level": 95
  },
  "factors_considered": ["factor 1", "factor 2"],
  "key_assumptions": ["assumption 1", "assumption 2"],
  "sensitivity_analysis": {
    "income_change_10_percent": {"refund_impact": 0.00},
    "additional_deduction_5000": {"refund_impact": 0.00}
  },
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Be data-driven, realistic, and provide actionable insights.`;try{let{text:e}=await (0,t.generateText)({model:"openai/gpt-4o",prompt:a,maxTokens:2e3}),r=e.trim();r.startsWith("```")&&(r=(r=(r=r.replace(/^```(?:json)?\n?/,"")).replace(/\n?```$/,"")).trim());let i=JSON.parse(r);return await this.supabase.from("predictive_tax_models").insert({user_id:this.userId,model_type:"refund_prediction",prediction_data:i,confidence_interval:i.confidence_interval,factors_considered:i.factors_considered,created_by:"Leo",valid_until:new Date(Date.now()+7776e6).toISOString()}),i}catch(e){return console.error("[Prediction] Error generating prediction:",e),null}}},"TaxOptimizationEngine",0,class{supabase;userId;constructor(e,t){this.supabase=e,this.userId=t}async findOptimizations(e){console.log("[Optimization] Finding advanced tax optimization strategies...");let r=`You are an expert tax optimization AI analyzing a user's complete tax situation to find sophisticated strategies.

Tax Data:
${JSON.stringify(e,null,2)}

Identify 5-10 advanced tax optimization strategies. Consider:
1. Timing strategies (when to recognize income/deductions)
2. Structural strategies (business entity optimization)
3. Investment strategies (tax-loss harvesting, qualified dividends)
4. Retirement strategies (401k, IRA, HSA optimization)
5. Charitable giving strategies
6. Real estate strategies
7. Multi-year planning strategies

Return a JSON array:
[
  {
    "strategy_name": "Name of strategy",
    "strategy_type": "deduction|credit|timing|structure|investment",
    "description": "Detailed explanation",
    "potential_savings": 0.00,
    "implementation_difficulty": "easy|moderate|complex",
    "time_horizon": "immediate|this_year|multi_year",
    "requirements": {"requirement": "details"},
    "steps": [{"step": 1, "action": "what to do"}],
    "risks": [{"risk": "potential downside"}],
    "recommended_by": "Riley",
    "priority_score": 0-100
  }
]

Be creative, sophisticated, and practical. These should be strategies that most people don't know about.`;try{let{text:e}=await (0,t.generateText)({model:"openai/gpt-4o",prompt:r,maxTokens:3e3}),a=e.trim();a.startsWith("```")&&(a=(a=(a=a.replace(/^```(?:json)?\n?/,"")).replace(/\n?```$/,"")).trim());let i=JSON.parse(a);for(let e of i)await this.supabase.from("tax_optimization_strategies").insert({user_id:this.userId,...e,status:"suggested"});return i}catch(e){return console.error("[Optimization] Error finding strategies:",e),[]}}}])},371231,e=>{"use strict";var t=e.i(682544),r=e.i(477416),a=e.i(888760),i=e.i(178890),n=e.i(685495),s=e.i(590424),o=e.i(333238),l=e.i(531427),c=e.i(172393),u=e.i(501598),d=e.i(133377),p=e.i(15902),m=e.i(115676),g=e.i(110214),h=e.i(376296),f=e.i(193695);e.i(633637);var y=e.i(712539),_=e.i(70996),x=e.i(110043),b=e.i(701230),v=e.i(419142);let w=(0,b.tool)({description:"Get the current status of a tax return filing, including IRS acceptance status, refund status, and estimated timeline",parameters:v.z.object({userId:v.z.string().optional().describe("User ID to check filing status for"),filingId:v.z.string().optional().describe("Specific filing ID to check")}),execute:async({userId:e,filingId:t})=>{let r=await (0,x.createClient)();if(!r)return{success:!1,message:"Filing status is not available in demo mode. Please sign in to view real data."};let a=r.from("tax_filings").select("*").order("created_at",{ascending:!1});t?a=a.eq("id",t):e&&(a=a.eq("user_id",e));let{data:i,error:n}=await a.limit(1).single();return n||!i?{success:!1,message:"No filing found"}:{success:!0,filing:{id:i.id,status:i.filing_status,provider_status:i.irs_status,submitted_at:i.filed_at,irs_accepted_at:i.accepted_at,refund_amount:i.refund_or_owed,refund_status:i.irs_status,estimated_refund_date:null},statusMessage:function(e,t){switch(e){case"pending":return"Your return is being prepared for submission to the IRS.";case"submitted":return"Your return has been submitted to the IRS and is awaiting acceptance.";case"accepted":return"Great news! The IRS has accepted your return and is processing it.";case"processing":return"The IRS is processing your return. Your refund should be issued soon.";case"refund_approved":return"Your refund has been approved! It should arrive in your account within 5 business days.";case"refund_sent":return"Your refund has been sent! Check your bank account for the deposit.";case"rejected":return`Your return was rejected by the IRS. Reason: ${t||"Unknown"}. Please review and resubmit.`;case"failed":return"There was an error submitting your return. Please contact support.";default:return"Status unknown. Please contact support for assistance."}}(i.filing_status,i.irs_status)}}}),S=(0,b.tool)({description:"Get the filing history for a user, including all past returns and their statuses",parameters:v.z.object({userId:v.z.string().describe("User ID to get filing history for"),limit:v.z.number().optional().default(5).describe("Number of filings to return")}),execute:async({userId:e,limit:t})=>{let r=await (0,x.createClient)();if(!r)return{success:!1,message:"Filing history is not available in demo mode."};let{data:a,error:i}=await r.from("tax_filings").select("*").eq("user_id",e).order("created_at",{ascending:!1}).limit(t);return i?{success:!1,message:"Failed to fetch filing history"}:{success:!0,filings:a.map(e=>({id:e.id,tax_year:e.tax_year,status:e.filing_status,submitted_at:e.filed_at,refund_amount:e.refund_or_owed,refund_status:e.irs_status}))}}}),I=(0,b.tool)({description:"Calculate estimated timeline for tax return processing and refund based on current IRS processing times",parameters:v.z.object({filingMethod:v.z.enum(["efile","paper"]).describe("How the return was filed"),refundMethod:v.z.enum(["direct_deposit","check"]).describe("How the refund will be received"),filingDate:v.z.string().optional().describe("Date the return was filed (ISO format)")}),execute:async({filingMethod:e,refundMethod:t,filingDate:r})=>{let a=r?new Date(r):new Date,i="efile"===e?21:42,n=7*("direct_deposit"!==t),s=new Date(a);s.setDate(s.getDate()+1);let o=new Date(a);return o.setDate(o.getDate()+i+n),{success:!0,timeline:{filed_date:a.toISOString(),expected_acceptance:s.toISOString(),expected_refund:o.toISOString(),total_days:i+n,filing_method:e,refund_method:t},message:`Your return should be accepted within 1 day, and you can expect your refund in approximately ${i+n} days via ${"direct_deposit"===t?"direct deposit":"paper check"}.`}}});var R=e.i(611263);async function k(e){try{console.log("[v0] Chat API: Request received");let{messages:t,agent:r="Sam",model:a="openai/gpt-4o",context:i=""}=await e.json(),n=R.AGENT_PERSONALITIES[r]||R.AGENT_PERSONALITIES.Sam,s=await (0,x.createClient)(),o=null;if(s){let{data:e}=await s.auth.getUser();o=e.user}let l=`
You are ${n.name}, the ${n.role} at Taxu.

PERSONALITY:
${n.personality}

EXPERTISE:
${n.expertise.map(e=>`- ${e}`).join("\n")}

COMMUNICATION STYLE:
${n.communication_style}

DECISION MAKING:
${n.decision_making}

---
INTELLIGENCE INSTRUCTIONS:
1. **Think Step-by-Step**: Before answering complex questions, break them down logically.
2. **Be Proactive**: Don't just answer the question; anticipate the user's next need.
3. **Context Aware**: Use the provided user context to personalize your answer.
4. **Safety & Compliance**: Never encourage tax evasion.
5. **Formatting**: Use Markdown (bolding, lists) to make your responses easy to read.
---

CONTEXT:
You are helping a user on the Taxu platform.
${o?`User ID: ${o.id}`:"User is currently unauthenticated (Demo Mode)."}
${i?`Current Page/State Context: ${i}`:""}
`;return console.log(`[v0] Chat API: Streaming response for agent ${n.name} with model ${a}`),(await (0,_.streamText)({model:a,messages:t,system:l,temperature:.7,maxTokens:1e3,tools:{getFilingStatus:w,getFilingHistory:S,getEstimatedTimeline:I},maxSteps:5})).toDataStreamResponse()}catch(e){return console.error("[v0] Chat API error:",e),new Response(JSON.stringify({error:"Failed to process chat request",details:e instanceof Error?e.message:"Unknown error"}),{status:500,headers:{"Content-Type":"application/json"}})}}e.s(["POST",0,k,"maxDuration",0,30],976935);var C=e.i(976935);let O=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/taxu-platform/v0-taxu-landing-page/app/api/chat/route.ts",nextConfigOutput:"",userland:C}),{workAsyncStorage:A,workUnitAsyncStorage:E,serverHooks:T}=O;async function N(e,t,a){O.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let _="/api/chat/route";_=_.replace(/\/index$/,"")||"/";let x=await O.prepare(e,t,{srcPage:_,multiZoneDraftMode:!1});if(!x)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:b,params:v,nextConfig:w,parsedUrl:S,isDraftMode:I,prerenderManifest:R,routerServerContext:k,isOnDemandRevalidate:C,revalidateOnlyGenerated:A,resolvedPathname:E,clientReferenceManifest:T,serverActionsManifest:N}=x,P=(0,o.normalizeAppPath)(_),D=!!(R.dynamicRoutes[P]||R.routes[E]),$=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,S,!1):t.end("This page could not be found"),null);if(D&&!I){let e=!!R.routes[E],t=R.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(w.experimental.adapterPath)return await $();throw new f.NoFallbackError}}let j=null;!D||O.isDev||I||(j="/index"===(j=E)?"/":j);let z=!0===O.isDev||!D,q=D&&!z;N&&T&&(0,s.setManifestsSingleton)({page:_,clientReferenceManifest:T,serverActionsManifest:N});let M=e.method||"GET",U=(0,n.getTracer)(),H=U.getActiveScopeSpan(),F={params:v,prerenderManifest:R,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:z,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:w.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,i)=>O.onRequestError(e,t,a,i,k)},sharedContext:{buildId:b}},L=new l.NodeNextRequest(e),J=new l.NodeNextResponse(t),G=c.NextRequestAdapter.fromNodeNextRequest(L,(0,c.signalFromNodeResponse)(t));try{let s=async e=>O.handle(G,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=U.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${M} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${M} ${_}`)}),o=!!(0,i.getRequestMeta)(e,"minimalMode"),l=async i=>{var n,l;let c=async({previousCacheEntry:r})=>{try{if(!o&&C&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(i);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let c=F.renderOpts.collectedTags;if(!D)return await (0,p.sendResponse)(L,J,n,F.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(n.headers);c&&(t[h.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,a=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:C})},!1,k),t}},u=await O.handleResponse({req:e,nextConfig:w,cacheKey:j,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:R,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:A,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:o});if(!D)return null;if((null==u||null==(n=u.value)?void 0:n.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",C?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let f=(0,m.fromNodeOutgoingHttpHeaders)(u.value.headers);return o&&D||f.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||f.get("Cache-Control")||f.set("Cache-Control",(0,g.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(L,J,new Response(u.value.body,{headers:f,status:u.value.status||200})),null};H?await l(H):await U.withPropagatedContext(e.headers,()=>U.trace(u.BaseServerSpan.handleRequest,{spanName:`${M} ${_}`,kind:n.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},l))}catch(t){if(t instanceof f.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:C})},!1,k),D)throw t;return await (0,p.sendResponse)(L,J,new Response(null,{status:500})),null}}e.s(["handler",0,N,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:E})},"routeModule",0,O,"serverHooks",0,T,"workAsyncStorage",0,A,"workUnitAsyncStorage",0,E],371231)},819623,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__578b36f1._.js"].map(t=>e.l(t))).then(()=>t(443410)))},941867,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__ba837d10._.js"].map(t=>e.l(t))).then(()=>t(778382)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__2f7deae1._.js.map