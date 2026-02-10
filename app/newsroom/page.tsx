import { marketingPages } from "@/lib/marketing-content"
import { MarketingPageTemplate } from "@/components/marketing-template"

export default function NewsroomPage() {
  return <MarketingPageTemplate {...marketingPages.newsroom} />
}
