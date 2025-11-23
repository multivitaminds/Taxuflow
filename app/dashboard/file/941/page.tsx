import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import Form941Dashboard from "@/components/form-941-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Form941 from "@/components/forms/form-941"
import { Button } from "@/components/ui/button"
import { Download, Upload, LinkIcon } from "lucide-react"
import EFTPSDepositTracker from "@/components/eftps-deposit-tracker"
import SafeHarborCalculator from "@/components/safe-harbor-calculator"
import LookbackPeriodTracker from "@/components/lookback-period-tracker"
import ScheduleBGenerator from "@/components/schedule-b-generator"

export default async function File941Page() {
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

  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-orange-500/5 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-orange-500/10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Form 941 - Quarterly Payroll Taxes
            </h1>
            <p className="text-muted-foreground mt-2">Employer's Quarterly Federal Tax Return</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <LinkIcon className="h-4 w-4 mr-2" />
              Connect Payroll
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="file">File New 941</TabsTrigger>
            <TabsTrigger value="deposits">EFTPS Deposits</TabsTrigger>
            <TabsTrigger value="schedule-b">Schedule B</TabsTrigger>
            <TabsTrigger value="safe-harbor">Safe Harbor</TabsTrigger>
            <TabsTrigger value="lookback">Lookback Period</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Form941Dashboard />
          </TabsContent>

          <TabsContent value="file">
            <Form941 />
          </TabsContent>

          <TabsContent value="deposits">
            <EFTPSDepositTracker taxYear={currentYear} quarter={currentQuarter} />
          </TabsContent>

          <TabsContent value="schedule-b">
            <ScheduleBGenerator taxYear={currentYear} quarter={currentQuarter} />
          </TabsContent>

          <TabsContent value="safe-harbor">
            <SafeHarborCalculator taxYear={currentYear} quarter={currentQuarter} />
          </TabsContent>

          <TabsContent value="lookback">
            <LookbackPeriodTracker currentYear={currentYear} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
