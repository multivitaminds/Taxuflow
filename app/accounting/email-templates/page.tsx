import type { Metadata } from "next"
import EmailTemplatesClient from "./EmailTemplatesClient"

export const metadata: Metadata = {
  title: "Email Templates",
  description: "Manage email templates for invoices, receipts, and reminders",
}

export default function EmailTemplatesPage() {
  return <EmailTemplatesClient />
}
