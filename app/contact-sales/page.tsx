import type { Metadata } from "next"
import { ContactSalesClient } from "@/components/contact-sales-client"

export const metadata: Metadata = {
  title: "Contact Sales - Taxu",
  description: "Get in touch with our sales team for Enterprise plans and custom solutions",
}

export default function ContactSalesPage() {
  return <ContactSalesClient />
}
