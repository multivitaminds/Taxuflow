// Mock e-file provider for development and testing

import type { EFileProvider, TaxReturn, FilingResult, FilingStatusResponse, FilingStatus } from "../types"

export class MockEFileProvider implements EFileProvider {
  name = "Mock E-File Provider"

  async submitReturn(taxReturn: TaxReturn): Promise<FilingResult> {
    console.log("[v0] Mock provider: Submitting return for", taxReturn.taxpayer.firstName, taxReturn.taxpayer.lastName)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock submission ID
    const submissionId = `MOCK-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Simulate 95% success rate
    const success = Math.random() > 0.05

    if (success) {
      return {
        success: true,
        submissionId,
        status: "submitted",
        message: "Return submitted successfully to IRS",
        estimatedProcessingTime: "24-48 hours",
      }
    } else {
      return {
        success: false,
        submissionId,
        status: "rejected",
        message: "Return rejected by IRS",
        errors: ["Invalid SSN format", "Missing W-2 information"],
      }
    }
  }

  async getFilingStatus(submissionId: string): Promise<FilingStatusResponse> {
    console.log("[v0] Mock provider: Getting status for", submissionId)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate different statuses based on submission ID
    const statuses: FilingStatus[] = ["submitted", "processing", "accepted", "rejected"]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    return {
      submissionId,
      status: randomStatus,
      irsStatus: randomStatus === "accepted" ? "Accepted" : randomStatus === "rejected" ? "Rejected" : "Processing",
      acceptedAt: randomStatus === "accepted" ? new Date().toISOString() : undefined,
      rejectedAt: randomStatus === "rejected" ? new Date().toISOString() : undefined,
      rejectionReasons: randomStatus === "rejected" ? ["Form 1040 line 7 calculation error"] : undefined,
      refundStatus:
        randomStatus === "accepted"
          ? {
              federal: "approved",
              state: "pending",
              estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            }
          : undefined,
    }
  }

  async cancelFiling(submissionId: string): Promise<boolean> {
    console.log("[v0] Mock provider: Canceling filing", submissionId)
    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  }
}
