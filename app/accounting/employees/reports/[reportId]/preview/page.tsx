import type { Metadata } from "next"
import { ReportPreviewClient } from "@/components/report-preview-client"

export const metadata: Metadata = {
  title: "Report Preview | Taxu",
  description: "Preview and download employee report",
}

export default async function ReportPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>
  searchParams: Promise<{ format?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return <ReportPreviewClient reportId={resolvedParams.reportId} format={resolvedSearchParams.format || "pdf"} />
}
