import { marketingPages } from "@/lib/marketing-content"
import { MarketingPageTemplate } from "@/components/marketing-template"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return Object.keys(marketingPages).map((slug) => ({
    slug,
  }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const pageData = marketingPages[resolvedParams.slug as keyof typeof marketingPages]

  if (!pageData) {
    notFound()
  }

  return <MarketingPageTemplate {...pageData} />
}
