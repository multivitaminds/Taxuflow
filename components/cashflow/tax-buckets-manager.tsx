"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { PiggyBank, TrendingUp, Calculator, DollarSign, Plus, ArrowLeftRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface TaxBucket {
  id: string
  name: string
  balance: number
  goal: number
  percentage: number
  color: string
  liability: number // Estimated tax liability
}

const initialBuckets: TaxBucket[] = [
  {
    id: "fed",
    name: "Federal Income Tax",
    balance: 8500.0,
    goal: 15000.0,
    percentage: 15,
    color: "#635bff",
    liability: 12000,
  },
  {
    id: "state",
    name: "State Tax (CA)",
    balance: 2500.0,
    goal: 4000.0,
    percentage: 5,
    color: "#00d4ff",
    liability: 3200,
  },
  { id: "sales", name: "Sales Tax", balance: 1500.0, goal: 2000.0, percentage: 2, color: "#32d74b", liability: 1800 },
]

export function TaxBucketsManager() {
  const [buckets, setBuckets] = useState<TaxBucket[]>(initialBuckets)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  const totalBalance = buckets.reduce((acc, bucket) => acc + bucket.balance, 0)
  const totalGoal = buckets.reduce((acc, bucket) => acc + bucket.goal, 0)
  const totalPercentage = buckets.reduce((acc, bucket) => acc + bucket.percentage, 0)

  const updateBucketPercentage = (id: string, value: number) => {
    setBuckets(buckets.map((b) => (b.id === id ? { ...b, percentage: value } : b)))
  }

  const chartData = buckets.map((b) => ({
    name: b.name.split(" ")[0],
    Saved: b.balance,
    Liability: b.liability,
  }))

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Tax Buckets</h1>
          <p className="text-slate-500 mt-1">Automate your tax savings and never worry about tax season again.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-white text-[#0a2540] border-slate-200 hover:bg-slate-50"
            onClick={() => setIsTransferOpen(true)}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" /> Transfer Funds
          </Button>
          <Button className="bg-[#635bff] hover:bg-[#5851e1] text-white shadow-sm" onClick={() => toast.info("New bucket creation coming soon")}>
            <Plus className="mr-2 h-4 w-4" /> New Bucket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overview Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Tax Savings Overview</CardTitle>
              <CardDescription>Total funds set aside for upcoming tax payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase">Total Saved</p>
                  <p className="text-3xl font-bold text-[#0a2540]">${totalBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase">Estimated Liability</p>
                  <p className="text-3xl font-bold text-slate-600">${(17000).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase">Coverage</p>
                  <p className="text-3xl font-bold text-green-600">{Math.round((totalBalance / 17000) * 100)}%</p>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                    <Bar dataKey="Saved" fill="#635bff" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Liability" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Buckets List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Buckets</h3>
            {buckets.map((bucket) => (
              <Card key={bucket.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${bucket.color}20` }}
                      >
                        <PiggyBank className="h-5 w-5" style={{ color: bucket.color }} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0a2540]">{bucket.name}</h4>
                        <p className="text-sm text-slate-500">Auto-save {bucket.percentage}% of income</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${bucket.balance.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">of ${bucket.goal.toLocaleString()} goal</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span>{Math.round((bucket.balance / bucket.goal) * 100)}%</span>
                    </div>
                    <Progress
                      value={(bucket.balance / bucket.goal) * 100}
                      className="h-2"
                      indicatorColor={bucket.color}
                    />
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>On track to meet Q4 deadline</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#635bff] hover:bg-[#635bff]/10">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Auto-Save Configuration Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[#0a2540] text-white border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-[#00d4ff]" />
                <span className="text-[#00d4ff] font-medium text-sm uppercase tracking-wider">AI Recommendation</span>
              </div>
              <CardTitle className="text-xl">Increase Federal Savings</CardTitle>
              <CardDescription className="text-slate-300">
                Based on your recent income spike, our AI recommends increasing your Federal Tax bucket to 18%.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full bg-[#00d4ff] text-[#0a2540] hover:bg-[#00b0d4]">Apply Recommendation</Button>
            </CardFooter>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Auto-Save Configuration</CardTitle>
                <Switch
                  checked={autoSaveEnabled}
                  onCheckedChange={setAutoSaveEnabled}
                  className="data-[state=checked]:bg-[#635bff]"
                />
              </div>
              <CardDescription>Adjust how much of each deposit is automatically moved to tax buckets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {buckets.map((bucket) => (
                <div key={bucket.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium text-sm">{bucket.name}</Label>
                    <span className="text-sm font-bold text-[#635bff] bg-[#635bff]/10 px-2 py-1 rounded">
                      {bucket.percentage}%
                    </span>
                  </div>
                  <Slider
                    value={[bucket.percentage]}
                    max={50}
                    step={1}
                    className="py-2"
                    onValueChange={(vals) => updateBucketPercentage(bucket.id, vals[0])}
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center font-medium">
                  <span>Total Withholding</span>
                  <span className={cn("text-lg", totalPercentage > 40 ? "text-orange-600" : "text-[#0a2540]")}>
                    {totalPercentage}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">of every incoming deposit</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent" disabled={!autoSaveEnabled}>
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Transfer Dialog */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Funds</DialogTitle>
            <DialogDescription>Move money manually between your checking account and tax buckets.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>From</Label>
              <Input value="Business Checking (****4291)" disabled />
            </div>
            <div className="grid gap-2">
              <Label>To</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                {buckets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input className="pl-9" placeholder="0.00" type="number" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                toast.success("Transfer initiated successfully")
                setIsTransferOpen(false)
              }}
            >
              Transfer Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
