import { createClient } from "@/lib/supabase/server"

export interface DocumentRetentionRule {
  documentType: string
  retentionPeriodYears: number
  complianceFramework: string
  description: string
  autoArchive: boolean
  alertDaysBefore: number
}

export class DocumentLifecycleManager {
  private static rules: DocumentRetentionRule[] = [
    {
      documentType: "W-2",
      retentionPeriodYears: 7,
      complianceFramework: "IRS",
      description: "Employee wage and tax statements",
      autoArchive: true,
      alertDaysBefore: 90,
    },
    {
      documentType: "1099-NEC",
      retentionPeriodYears: 7,
      complianceFramework: "IRS",
      description: "Nonemployee compensation forms",
      autoArchive: true,
      alertDaysBefore: 90,
    },
    {
      documentType: "Tax Return",
      retentionPeriodYears: 7,
      complianceFramework: "IRS",
      description: "Annual tax returns and supporting documents",
      autoArchive: true,
      alertDaysBefore: 90,
    },
    {
      documentType: "Receipt",
      retentionPeriodYears: 7,
      complianceFramework: "IRS",
      description: "Business expense receipts",
      autoArchive: true,
      alertDaysBefore: 90,
    },
    {
      documentType: "Payroll Record",
      retentionPeriodYears: 7,
      complianceFramework: "IRS",
      description: "Employee payroll records",
      autoArchive: true,
      alertDaysBefore: 90,
    },
    {
      documentType: "Invoice",
      retentionPeriodYears: 7,
      complianceFramework: "IRS",
      description: "Sales invoices and supporting documents",
      autoArchive: true,
      alertDaysBefore: 90,
    },
  ]

  static getRetentionRule(documentType: string): DocumentRetentionRule | undefined {
    return this.rules.find((rule) => rule.documentType === documentType)
  }

  static calculateRetentionEndDate(uploadDate: Date, documentType: string): Date {
    const rule = this.getRetentionRule(documentType)
    if (!rule) {
      // Default to 7 years for IRS compliance
      const endDate = new Date(uploadDate)
      endDate.setFullYear(endDate.getFullYear() + 7)
      return endDate
    }

    const endDate = new Date(uploadDate)
    endDate.setFullYear(endDate.getFullYear() + rule.retentionPeriodYears)
    return endDate
  }

  static getDaysUntilExpiration(retentionEndDate: Date): number {
    const now = new Date()
    const diff = retentionEndDate.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  static getDocumentStatus(retentionEndDate: Date): "active" | "expiring-soon" | "expired" {
    const daysUntilExpiration = this.getDaysUntilExpiration(retentionEndDate)

    if (daysUntilExpiration < 0) {
      return "expired"
    } else if (daysUntilExpiration <= 90) {
      return "expiring-soon"
    } else {
      return "active"
    }
  }

  static async getExpiringDocuments(userId: string, daysThreshold = 90) {
    const supabase = await createClient()
    if (!supabase) return []

    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .lte("retention_end_date", thresholdDate.toISOString())
      .gte("retention_end_date", new Date().toISOString())

    if (error) {
      console.error("Error fetching expiring documents:", error)
      return []
    }

    return data
  }

  static async archiveDocument(documentId: string) {
    const supabase = await createClient()
    if (!supabase) return { success: false }

    const { error } = await supabase
      .from("documents")
      .update({ status: "archived", archived_at: new Date().toISOString() })
      .eq("id", documentId)

    if (error) {
      console.error("Error archiving document:", error)
      return { success: false, error }
    }

    return { success: true }
  }

  static async deleteDocument(documentId: string) {
    const supabase = await createClient()
    if (!supabase) return { success: false }

    // Verify document is expired before allowing deletion
    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("retention_end_date")
      .eq("id", documentId)
      .single()

    if (fetchError || !doc) {
      return { success: false, error: "Document not found" }
    }

    const status = this.getDocumentStatus(new Date(doc.retention_end_date))
    if (status !== "expired") {
      return { success: false, error: "Can only delete expired documents" }
    }

    const { error } = await supabase.from("documents").delete().eq("id", documentId)

    if (error) {
      console.error("Error deleting document:", error)
      return { success: false, error }
    }

    return { success: true }
  }
}
