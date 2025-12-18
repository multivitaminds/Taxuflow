import type { Metadata } from "next"
import EmailTemplateEditorClient from "./EmailTemplateEditorClient"

export const metadata: Metadata = {
  title: "Edit Email Template",
  description: "Customize email template",
}

export default function EmailTemplateEditorPage() {
  return <EmailTemplateEditorClient />
}
