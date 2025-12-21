import { marketingPages } from "@/lib/marketing-content"
import { MarketingPageTemplate } from "@/components/marketing-template"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return Object.keys(marketingPages).map((slug) => ({
    slug,
  }))
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const pageData = marketingPages[params.slug as keyof typeof marketingPages]

  if (!pageData) {
    notFound()
  }

  return <MarketingPageTemplate {...pageData} />
}
