import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import FormW2 from "@/components/forms/form-w2"
import { DocumentUpload } from "@/components/forms/document-upload"
import { QuickBooksSync } from "@/components/forms/quickbooks-sync"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function FileW2Page() {
  const supabase = await getSupabaseServerClient()

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
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-orange-500/5 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-orange-500/10 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              File Form W-2
            </h1>
            <p className="text-muted-foreground mt-2">Report employee wages and tax withholdings</p>
          </div>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-sm">
            <TabsTrigger value="upload">📄 Upload W-2</TabsTrigger>
            <TabsTrigger value="quickbooks">💼 QuickBooks</TabsTrigger>
            <TabsTrigger value="manual">✍️ Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <DocumentUpload userId={user.id} />
          </TabsContent>

          <TabsContent value="quickbooks" className="mt-6">
            <QuickBooksSync userId={user.id} />
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <FormW2 />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
