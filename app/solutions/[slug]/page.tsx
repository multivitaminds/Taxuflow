import { marketingPages } from "@/lib/marketing-content"
import { MarketingPageTemplate } from "@/components/marketing-template"
import { notFound } from "next/navigation"

const solutionSlugs = [
  "ecommerce",
  "saas",
  "marketplaces",
  "platforms",
  "embedded-finance",
  "creator-economy",
  "crypto",
  "global-businesses",
]

export function generateStaticParams() {
  return solutionSlugs.map((slug) => ({ slug }))
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const pageData = marketingPages[params.slug as keyof typeof marketingPages]

  if (!pageData || !solutionSlugs.includes(params.slug)) {
    notFound()
  }

  return <MarketingPageTemplate {...pageData} />
}
