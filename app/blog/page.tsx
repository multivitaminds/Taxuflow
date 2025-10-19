"use client"
import { useRouter } from "next/navigation"

export default function BlogPage() {
  const router = useRouter()

  const articles = [
    {
      title: "Understanding the Earned Income Tax Credit (EITC)",
      excerpt: "Learn how the EITC can boost your refund by thousands of dollars if you qualify.",
      category: "Tax Credits",
      readTime: "5 min read",
      date: "Jan 15, 2025",
      slug: "earned-income-tax-credit",
    },
    {
      title: "Freelancer's Guide to Quarterly Taxes",
      excerpt: "Everything you need to know about estimated tax payments and avoiding penalties.",
      category: "Self-Employment",
      readTime: "8 min read",
      date: "Jan 12, 2025",
      slug: "freelancer-quarterly-taxes",
    },
    {
      title: "How AI is Revolutionizing Tax Filing",
      excerpt: "Discover how artificial intelligence is making tax season faster, easier, and more accurate.",
      category: "Technology",
      readTime: "6 min read",
      date: "Jan 10, 2025",
      slug: "ai-revolutionizing-tax-filing",
    },
    {
      title: "Top 10 Tax Deductions You're Probably Missing",
      excerpt: "Don't leave money on the table. These commonly overlooked deductions could save you hundreds.",
      category: "Deductions",
      readTime: "7 min read",
      date: "Jan 8, 2025",
      slug: "top-10-tax-deductions",
    },
    {
      title: "What Triggers an IRS Audit?",
      excerpt: "Learn the red flags that increase your audit risk and how to avoid them.",
      category: "Compliance",
      readTime: "10 min read",
      date: "Jan 5, 2025",
      slug: "what-triggers-irs-audit",
    },
    {
      title: "LLC vs S-Corp: Which is Right for Your Business?",
      excerpt: "Compare the tax implications of different business structures to make the best choice.",
      category: "Business",
      readTime: "12 min read",
      date: "Jan 3, 2025",
      slug: "llc-vs-s-corp",
    },
  ]

  const handleArticleClick = (slug: string) => {
    console.log("[v0] Navigating to blog post:", slug)
    router.push(`/blog/${slug}`)
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="py-20 px-4 border-b border-neon/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Tax Knowledge Center</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered insights and expert guidance to help you master your taxes
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={index}
                onClick={() => handleArticleClick(article.slug)}
                className="group p-6 rounded-xl border border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 hover:shadow-lg hover:shadow-neon/10 transition-all cursor-pointer h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-neon">{article.category}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-neon transition-colors">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <span className="text-sm font-medium text-neon group-hover:underline">Read more →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
