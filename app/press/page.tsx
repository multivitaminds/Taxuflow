import { marketingPages } from "@/lib/marketing-content"
import { MarketingPageTemplate } from "@/components/marketing-template"

export default function PressPage() {
  return <MarketingPageTemplate {...marketingPages.press} />
}
