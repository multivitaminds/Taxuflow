import type { Metadata } from "next"
import EmailTemplatePreviewClient from "./EmailTemplatePreviewClient"

export const metadata: Metadata = {
  title: "Preview Email Template",
  description: "Preview email template with sample data",
}

export default function EmailTemplatePreviewPage() {
  return <EmailTemplatePreviewClient />
}
