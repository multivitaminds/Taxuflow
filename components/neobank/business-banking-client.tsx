"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, CreditCard, Users, DollarSign, TrendingUp, FileText, Briefcase, ArrowUpRight } from "lucide-react"

export function BusinessBankingClient() {
  const accounts = [
    {
      name: "Business Checking",
      balance: 284520,
      accountNumber: "****6789",
      type: "checking",
      monthlyActivity: 12450,
    },
    {
      name: "Business Savings",
      balance: 456780,
      accountNumber: "****3421",
      type: "savings",
      apr: 4.5,
    },
    {
      name: "Merchant Services",
      balance: 125680,
      accountNumber: "****9012",
      type: "merchant",
      monthlyVolume: 45200,
    },
  ]

  const features = [
    {
      title: "Multi-User Access",
      description: "Grant team members access with custom permissions",
      icon: Users,
      status: "Active",
    },
    {
      title: "Business Credit Card",
      description: "Up to $50,000 credit limit with rewards",
      icon: CreditCard,
      status: "Available",
    },
    {
      title: "Invoice Financing",
      description: "Get paid faster with invoice factoring",
      icon: FileText,
      status: "Active",
    },
    {
      title: "Business Loans",
      description: "Flexible financing from $10K to $500K",
      icon: Briefcase,
      status: "Apply Now",
    },
  ]

  const transactions = [
    { date: "Today", description: "Stripe Payment - Invoice #1234", amount: 2450, type: "credit" },
    { date: "Yesterday", description: "Office Supplies - Amazon Business", amount: -342, type: "debit" },
    { date: "Dec 3", description: "Payroll Processing", amount: -15680, type: "debit" },
    { date: "Dec 2", description: "Client Payment - ACH", amount: 8920, type: "credit" },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Business Banking</h1>
        <p className="text-slate-600 mt-1">Comprehensive banking solutions for your business</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 mt-1">Across all accounts</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,680</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-slate-600 mt-1">Team members with access</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Available</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$35,000</div>
            <p className="text-xs text-slate-600 mt-1">$50,000 limit</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="features">Business Services</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="space-y-4">
            {accounts.map((account) => (
              <Card key={account.accountNumber} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{account.name}</CardTitle>
                      <CardDescription>{account.accountNumber}</CardDescription>
                    </div>
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Balance</span>
                    <span className="text-2xl font-bold">${account.balance.toLocaleString()}</span>
                  </div>
                  {account.monthlyActivity && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Monthly Activity</span>
                      <span className="font-semibold text-green-600">+${account.monthlyActivity.toLocaleString()}</span>
                    </div>
                  )}
                  {account.apr && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">APY</span>
                      <span className="font-semibold text-blue-600">{account.apr}%</span>
                    </div>
                  )}
                  {account.monthlyVolume && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Monthly Volume</span>
                      <span className="font-semibold">${account.monthlyVolume.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Transfer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                    <Badge
                      variant={feature.status === "Active" ? "default" : "outline"}
                      className={
                        feature.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }
                    >
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{feature.description}</p>
                  <Button className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Business account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-slate-600">{transaction.date}</p>
                    </div>
                    <span
                      className={`font-bold ${transaction.type === "credit" ? "text-green-600" : "text-slate-900"}`}
                    >
                      {transaction.type === "credit" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Access Management</CardTitle>
              <CardDescription>Control who can access your business accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-slate-600">Owner - Full Access</p>
                    </div>
                  </div>
                  <Badge>Owner</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-slate-600">CFO - Financial Access</p>
                    </div>
                  </div>
                  <Badge variant="outline">Admin</Badge>
                </div>
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
