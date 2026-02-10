import { marketingPages } from "@/lib/marketing-content"
import { MarketingPageTemplate } from "@/components/marketing-template"

export default function SitemapPageView() {
  return <MarketingPageTemplate {...marketingPages.sitemap} />
}
