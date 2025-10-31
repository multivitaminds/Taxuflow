import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DocumentUpload } from "@/components/document-upload"
import { AutoFileButton } from "@/components/auto-file-button"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export default async function UploadPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let hasIncomeDocs = false
  let completedDocsCount = 0

  try {
    const { data: completedDocs } = await supabase
      .from("documents")
      .select("id, document_type")
      .eq("user_id", user.id)
      .eq("processing_status", "completed")

    if (completedDocs) {
      hasIncomeDocs = completedDocs.some((doc) => doc.document_type === "w2" || doc.document_type === "1099")
      completedDocsCount = completedDocs.length
    }
  } catch (error) {
    console.log("[v0] Documents table not yet created, skipping auto-file check")
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upload Tax Documents</h1>
          <p className="text-muted-foreground">
            Upload your W-2s, 1099s, receipts, and other tax documents. AI will automatically extract data and calculate
            deductions.
          </p>
        </div>

        {hasIncomeDocs && (
          <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Sparkles className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Ready to File!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You have {completedDocsCount} processed document{completedDocsCount !== 1 ? "s" : ""}. AI has
                  extracted all data and calculated your deductions. Click below to automatically file your taxes.
                </p>
                <AutoFileButton />
              </div>
            </div>
          </Card>
        )}

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur">
          <DocumentUpload
            onUploadComplete={() => {
              window.location.href = "/dashboard/documents/upload"
            }}
          />

          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="font-semibold mb-4">Accepted Document Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Income Documents</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• W-2 Forms</li>
                  <li>• 1099 Forms (all types)</li>
                  <li>• K-1 Forms</li>
                  <li>• Income Statements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Deduction Documents</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Receipts</li>
                  <li>• Mortgage Interest Statements</li>
                  <li>• Charitable Donation Records</li>
                  <li>• Medical Expense Records</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-neon/5 border border-neon/20 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-neon">🔒</span>
              Your documents are secure
            </h4>
            <p className="text-sm text-muted-foreground">
              All files are encrypted in transit and at rest. Only you can access your documents. We use bank-level
              256-bit encryption to protect your sensitive information.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
