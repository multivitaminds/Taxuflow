"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  DollarSign,
  PieChart,
  Settings,
  Download,
  Plus,
  ArrowUpRight,
} from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts"

const mockBuckets: Record<string, any> = {
  fed: {
    name: "Federal Income Tax",
    balance: 8500,
    goal: 15000,
    percentage: 15,
    color: "#635bff",
    liability: 12000,
  },
  state: {
    name: "State Tax (CA)",
    balance: 2500,
    goal: 4000,
    percentage: 5,
    color: "#00d4ff",
    liability: 3200,
  },
  sales: {
    name: "Sales Tax",
    balance: 1500,
    goal: 2000,
    percentage: 2,
    color: "#32d74b",
    liability: 1800,
  },
}

const transactionHistory = [
  { date: "Dec 15, 2024", type: "Auto-save", amount: 450, balance: 8500 },
  { date: "Dec 8, 2024", type: "Auto-save", amount: 450, balance: 8050 },
  { date: "Dec 1, 2024", type: "Manual Transfer", amount: 1000, balance: 7600 },
  { date: "Nov 24, 2024", type: "Auto-save", amount: 450, balance: 6600 },
  { date: "Nov 17, 2024", type: "Auto-save", amount: 450, balance: 6150 },
  { date: "Nov 10, 2024", type: "Auto-save", amount: 450, balance: 5700 },
]

const savingsProjection = [
  { month: "Jan", actual: 3200, projected: 3500 },
  { month: "Feb", actual: 4100, projected: 4800 },
  { month: "Mar", actual: 5300, projected: 6100 },
  { month: "Apr", actual: 6200, projected: 7400 },
  { month: "May", actual: 7100, projected: 8700 },
  { month: "Jun", actual: 8500, projected: 10000 },
  { month: "Jul", projected: 11300 },
  { month: "Aug", projected: 12600 },
  { month: "Sep", projected: 13900 },
  { month: "Oct", projected: 15000 },
]

export function BucketDetailClient({ bucketId }: { bucketId: string }) {
  const router = useRouter()
  const bucket = mockBuckets[bucketId] || mockBuckets.fed

  const progress = Math.round((bucket.balance / bucket.goal) * 100)
  const remaining = bucket.goal - bucket.balance
  const coverage = Math.round((bucket.balance / bucket.liability) * 100)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-[#0a2540]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/neobank/tax-buckets")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{bucket.name}</h1>
            <p className="text-slate-500 mt-1">Detailed view and transaction history</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/history`)}
            className="gap-2"
          >
            <Download className="h-4 w-4" /> Export History
          </Button>
          <Button
            onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/settings`)}
            className="bg-[#635bff] hover:bg-[#5851e1] gap-2"
          >
            <Settings className="h-4 w-4" /> Configure
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/balance`)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-[#635bff]/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#635bff]" />
              </div>
              <p className="text-sm font-medium text-slate-500">Current Balance</p>
            </div>
            <p className="text-2xl font-bold">${bucket.balance.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card
          className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/goal`)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-slate-500">Remaining to Goal</p>
            </div>
            <p className="text-2xl font-bold">${remaining.toLocaleString()}</p>
            <p className="text-xs text-slate-600 mt-1">{100 - progress}% remaining</p>
          </CardContent>
        </Card>

        <Card
          className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/coverage`)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm font-medium text-slate-500">Liability Coverage</p>
            </div>
            <p className="text-2xl font-bold">{coverage}%</p>
            <p className="text-xs text-slate-600 mt-1">of ${bucket.liability.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card
          className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/autosave`)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-slate-500">Auto-Save Rate</p>
            </div>
            <p className="text-2xl font-bold">{bucket.percentage}%</p>
            <p className="text-xs text-slate-600 mt-1">of each deposit</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings Projection Chart */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Savings Projection</CardTitle>
            <CardDescription>Actual savings vs projected goal through year end</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsProjection} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#635bff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#635bff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorActual)"
                  />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorProjected)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage this bucket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
              variant="outline"
              onClick={() => router.push("/neobank/transfers")}
            >
              <Plus className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Add Funds</div>
                <div className="text-xs text-slate-500">Manual transfer</div>
              </div>
            </Button>
            <Button
              className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
              variant="outline"
              onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/withdraw`)}
            >
              <ArrowUpRight className="h-5 w-5 rotate-180" />
              <div className="text-left">
                <div className="font-semibold">Withdraw Funds</div>
                <div className="text-xs text-slate-500">Transfer out</div>
              </div>
            </Button>
            <Button
              className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
              variant="outline"
              onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/settings`)}
            >
              <Settings className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Configure Auto-Save</div>
                <div className="text-xs text-slate-500">Adjust percentage</div>
              </div>
            </Button>
            <Button
              className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
              variant="outline"
              onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/payment`)}
            >
              <DollarSign className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Make Tax Payment</div>
                <div className="text-xs text-slate-500">Pay directly from bucket</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent activity in this bucket</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/history`)}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactionHistory.map((transaction, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-all border border-slate-100"
                onClick={() => router.push(`/neobank/tax-buckets/${bucketId}/transaction/${index}`)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.type === "Auto-save" ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    <Plus
                      className={`h-5 w-5 ${transaction.type === "Auto-save" ? "text-green-600" : "text-blue-600"}`}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{transaction.type}</p>
                    <p className="text-xs text-slate-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+${transaction.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Balance: ${transaction.balance.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
