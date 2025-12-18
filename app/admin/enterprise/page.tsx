import type { Metadata } from "next"
import { EnterpriseAdminClient } from "@/components/admin/enterprise-admin-client"

export const metadata: Metadata = {
  title: "Enterprise Administration | Taxu",
  description: "Manage enterprise features, SSO, compliance, and branding",
}

export default function EnterpriseAdminPage() {
  return <EnterpriseAdminClient />
}
