import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DocumentUpload } from "@/components/document-upload"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function UploadPage() {
  let supabase
  let user = null
  let error = null

  try {
    supabase = await createClient()
    const { data, error: authError } = await supabase.auth.getUser()

    if (authError) {
      error = authError.message
    } else {
      user = data.user
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to connect to database"
  }

  if (!user && !error) {
    redirect("/login")
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <Card className="p-8 border-destructive/50 bg-destructive/5">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-destructive mb-2">Configuration Error</h2>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  Please ensure your Supabase environment variables are properly configured in your Vercel project
                  settings.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
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
          <p className="text-muted-foreground">Upload your W-2s, 1099s, receipts, and other tax documents securely</p>
        </div>

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur">
          <DocumentUpload
            onUploadComplete={() => {
              window.location.href = "/dashboard"
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
