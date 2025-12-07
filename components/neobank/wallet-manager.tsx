"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Download,
  Settings,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  LinkIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createNeobankAccount } from "@/app/actions/neobank/create-account"

const accounts = [
  {
    id: "acc_1",
    type: "checking",
    balance: 85000.0,
    accountNumber: "4291 8821 0034",
    routingNumber: "121000248",
    status: "active",
    nickname: "Business Checking",
  },
  {
    id: "acc_2",
    type: "savings",
    balance: 45000.0,
    accountNumber: "4291 8821 0056",
    routingNumber: "121000248",
    status: "active",
    nickname: "Emergency Fund",
  },
]

const externalAccounts = [
  {
    id: "ext_1",
    bankName: "Chase Bank",
    accountType: "checking",
    accountNumberLast4: "8844",
    status: "verified",
    linkedDate: "2024-10-01",
  },
  {
    id: "ext_2",
    bankName: "Bank of America",
    accountType: "savings",
    accountNumberLast4: "2213",
    status: "pending_verification",
    linkedDate: "2024-11-20",
  },
]

const recentTransfers = [
  {
    id: "tfr_1",
    type: "ach_credit",
    amount: 5000.0,
    fromAccount: "Chase Bank ••8844",
    toAccount: "Business Checking",
    status: "completed",
    date: "2024-11-28",
  },
  {
    id: "tfr_2",
    type: "internal",
    amount: 10000.0,
    fromAccount: "Business Checking",
    toAccount: "Emergency Fund",
    status: "completed",
    date: "2024-11-27",
  },
  {
    id: "tfr_3",
    type: "ach_debit",
    amount: 2500.0,
    fromAccount: "Business Checking",
    toAccount: "Chase Bank ••8844",
    status: "processing",
    date: "2024-11-29",
  },
]

const statements = [
  { id: "stmt_1", period: "October 2024", date: "2024-11-01", type: "Monthly Statement" },
  { id: "stmt_2", period: "September 2024", date: "2024-10-01", type: "Monthly Statement" },
  { id: "stmt_3", period: "August 2024", date: "2024-09-01", type: "Monthly Statement" },
]

export function WalletManager() {
  const [showBalance, setShowBalance] = useState(true)
  const [showAccountNumbers, setShowAccountNumbers] = useState(false)
  const [selectedAccountType, setSelectedAccountType] = useState<"checking" | "savings">("checking")
  const [accountNickname, setAccountNickname] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""))
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "processing":
      case "pending_verification":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />
    }
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  const handleCreateAccount = async () => {
    setIsCreating(true)

    console.log("[v0] Creating new account:", { type: selectedAccountType })

    const result = await createNeobankAccount(selectedAccountType)

    if (result.error) {
      console.error("[v0] Error creating account:", result.error)
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      console.log("[v0] Account created successfully:", result.data)
      toast({
        title: "Account created",
        description: `Your ${selectedAccountType} account has been created successfully.`,
      })

      setIsDialogOpen(false)
      setAccountNickname("")

      // Reload the page to show the new account
      window.location.reload()
    }

    setIsCreating(false)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts & Wallet</h1>
          <p className="text-slate-500 mt-1">Manage your bank accounts, external links, and statements.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white text-[#0a2540] border-slate-200 hover:bg-slate-50">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#635bff] hover:bg-[#5851e1] text-white shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> New Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Open New Account</DialogTitle>
                <DialogDescription>Create a new checking or savings account instantly.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-md"
                    value={selectedAccountType}
                    onChange={(e) => setSelectedAccountType(e.target.value as "checking" | "savings")}
                  >
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Account Nickname</Label>
                  <Input
                    placeholder="e.g., Travel Fund, Payroll Account"
                    value={accountNickname}
                    onChange={(e) => setAccountNickname(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-[#635bff] hover:bg-[#5851e1] text-white"
                  onClick={handleCreateAccount}
                  disabled={isCreating}
                >
                  {isCreating ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-br from-[#0a2540] to-[#1a3555] text-white border-none shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
                Total Balance
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-300 hover:text-white hover:bg-white/10"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  {showBalance ? `$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••"}
                </span>
                <span className="text-green-400 text-sm font-medium flex items-center bg-green-400/10 px-2 py-1 rounded-full">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +4.2%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-xs">FDIC Insured</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList className="bg-white p-1 border border-slate-200 shadow-sm rounded-lg h-auto">
          <TabsTrigger
            value="accounts"
            className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2"
          >
            My Accounts
          </TabsTrigger>
          <TabsTrigger
            value="external"
            className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2"
          >
            External Links
          </TabsTrigger>
          <TabsTrigger
            value="transfers"
            className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2"
          >
            Transfer History
          </TabsTrigger>
          <TabsTrigger
            value="statements"
            className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2"
          >
            Statements
          </TabsTrigger>
        </TabsList>

        {/* My Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#635bff]/10 p-3 rounded-lg">
                      <Building2 className="h-6 w-6 text-[#635bff]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.nickname}</CardTitle>
                      <p className="text-sm text-slate-500 capitalize">{account.type} Account</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-100 capitalize flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" /> {account.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Available Balance</p>
                    <p className="text-2xl font-bold text-[#0a2540]">
                      {showBalance
                        ? `$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        : "••••••"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Account Number</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-slate-400"
                        onClick={() => setShowAccountNumbers(!showAccountNumbers)}
                      >
                        {showAccountNumbers ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono">
                        {showAccountNumbers ? account.accountNumber : "•••• •••• " + account.accountNumber.slice(-4)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-[#0a2540]"
                        onClick={() => copyToClipboard(account.accountNumber, "Account number")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Routing Number</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono">{account.routingNumber}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-[#0a2540]"
                        onClick={() => copyToClipboard(account.routingNumber, "Routing number")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6 pt-6 border-t border-slate-100">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Download className="mr-2 h-4 w-4" /> Download Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Settings className="mr-2 h-4 w-4" /> Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* External Links Tab */}
        <TabsContent value="external" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Connected Banks</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Link external bank accounts for easy transfers</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#635bff] hover:bg-[#5851e1] text-white">
                      <LinkIcon className="mr-2 h-4 w-4" /> Link Bank
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Link External Bank Account</DialogTitle>
                      <DialogDescription>Connect your external bank account securely via Plaid.</DialogDescription>
                    </DialogHeader>
                    <div className="py-8 text-center space-y-4">
                      <div className="bg-[#635bff]/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Shield className="h-8 w-8 text-[#635bff]" />
                      </div>
                      <p className="text-sm text-slate-600">
                        Bank-level encryption and security. Your credentials are never stored.
                      </p>
                      <Button className="w-full bg-[#635bff] hover:bg-[#5851e1] text-white">Continue with Plaid</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {externalAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <Building2 className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{account.bankName}</p>
                      <p className="text-xs text-slate-500 capitalize">
                        {account.accountType} •••• {account.accountNumberLast4}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "capitalize flex items-center gap-1",
                        account.status === "verified"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-orange-100 text-orange-700 hover:bg-orange-100",
                      )}
                    >
                      {getStatusIcon(account.status)}
                      {account.status.replace("_", " ")}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfer History Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle>Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentTransfers.map((transfer) => (
                  <div key={transfer.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            transfer.type === "ach_credit" && "bg-green-100",
                            transfer.type === "ach_debit" && "bg-orange-100",
                            transfer.type === "internal" && "bg-blue-100",
                          )}
                        >
                          {transfer.type === "ach_credit" && <ArrowDownRight className="h-4 w-4 text-green-600" />}
                          {transfer.type === "ach_debit" && <ArrowUpRight className="h-4 w-4 text-orange-600" />}
                          {transfer.type === "internal" && <ArrowUpRight className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {transfer.fromAccount} → {transfer.toAccount}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">
                            {transfer.type.replace("_", " ")} • {transfer.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">${transfer.amount.toLocaleString()}</p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-5 flex items-center gap-1",
                            transfer.status === "completed"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-100",
                          )}
                        >
                          {getStatusIcon(transfer.status)}
                          {transfer.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statements Tab */}
        <TabsContent value="statements" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle>Account Statements</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {statements.map((statement) => (
                  <div
                    key={statement.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-3 rounded-lg">
                        <Download className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{statement.period}</p>
                        <p className="text-xs text-slate-500">{statement.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{statement.date}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
