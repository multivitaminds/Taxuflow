import type { Metadata } from "next"
import { ReportPreviewClient } from "@/components/report-preview-client"

export const metadata: Metadata = {
  title: "Report Preview | Taxu",
  description: "Preview and download employee report",
}

export default function ReportPreviewPage({
  params,
  searchParams,
}: {
  params: { reportId: string }
  searchParams: { format?: string }
}) {
  return <ReportPreviewClient reportId={params.reportId} format={searchParams.format || "pdf"} />
}
