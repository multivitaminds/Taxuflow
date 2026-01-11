import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const articles = {
  "earned-income-tax-credit": {
    title: "Understanding the Earned Income Tax Credit (EITC)",
    category: "Tax Credits",
    readTime: "5 min read",
    date: "Jan 15, 2025",
    content: `
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
    `,
  },
  "freelancer-quarterly-taxes": {
    title: "Freelancer's Guide to Quarterly Taxes",
    category: "Self-Employment",
    readTime: "8 min read",
    date: "Jan 12, 2025",
    content: `
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
    `,
  },
  "ai-revolutionizing-tax-filing": {
    title: "How AI is Revolutionizing Tax Filing",
    category: "Technology",
    readTime: "6 min read",
    date: "Jan 10, 2025",
    content: `
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
    `,
  },
  "top-10-tax-deductions": {
    title: "Top 10 Tax Deductions You're Probably Missing",
    category: "Deductions",
    readTime: "7 min read",
    date: "Jan 8, 2025",
    content: `
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
    `,
  },
  "what-triggers-irs-audit": {
    title: "What Triggers an IRS Audit?",
    category: "Compliance",
    readTime: "10 min read",
    date: "Jan 5, 2025",
    content: `
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
    `,
  },
  "llc-vs-s-corp": {
    title: "LLC vs S-Corp: Which is Right for Your Business?",
    category: "Business",
    readTime: "12 min read",
    date: "Jan 3, 2025",
    content: `
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
    `,
  },
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const article = articles[resolvedParams.slug as keyof typeof articles]

  if (!article) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <article className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-neon hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-neon">{article.category}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{article.readTime}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{article.date}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-neon prose-strong:text-foreground prose-ul:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* CTA Section */}
          <div className="mt-16 p-8 rounded-xl border border-neon/20 bg-card/50 backdrop-blur text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Simplify Your Taxes?</h3>
            <p className="text-muted-foreground mb-6">
              Let Taxu's AI agents handle the complexity while you focus on what matters.
            </p>
            <Link href="/get-started">
              <Button size="lg" className="bg-neon text-background hover:bg-neon/90">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
