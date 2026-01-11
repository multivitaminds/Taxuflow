import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Users, Upload, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default async function Filing1099Page() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <DemoModeBanner />
      <div className="min-h-screen bg-background pt-3.5">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">1099 Filing & Management</h1>
            <p className="text-muted-foreground">File 1099 forms for contractors and manage recipient information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 border-neon/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold">File 1099-NEC</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Report nonemployee compensation for independent contractors who earned $600 or more
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Single or bulk filing</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Automatic IRS submission</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Recipient copy generation</span>
                </li>
              </ul>
              <Link href="/dashboard/file/1099-nec">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Start Filing 1099-NEC</Button>
              </Link>
            </Card>

            <Card className="p-6 border-neon/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-xl font-bold">Manage Recipients</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Add and manage contractor information for easy filing and record keeping
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>Store TIN/SSN securely</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>Track payment history</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>CSV import/export</span>
                </li>
              </ul>
              <Link href="/recipients">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">Manage Recipients</Button>
              </Link>
            </Card>
          </div>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-neon" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Bulk Filing with CSV</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Need to file multiple 1099 forms? Upload a CSV file with all your contractor information and we'll
                  handle the rest. Perfect for businesses with many contractors.
                </p>
                <Link href="/dashboard/file/1099-nec">
                  <Button variant="outline" className="border-neon/20 bg-transparent">
                    Learn More About Bulk Filing
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="mt-6 p-6 border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span className="text-orange-500">⚠️</span>
              Important Deadlines
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 1099-NEC forms must be filed by January 31st</li>
              <li>• Recipient copies must be provided by January 31st</li>
              <li>• Late filing penalties start at $60 per form</li>
              <li>• Intentional disregard penalties can be $310+ per form</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
