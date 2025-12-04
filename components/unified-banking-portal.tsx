"use client"
import { Card } from "@/components/ui/card"
import { Wallet, CreditCard, ArrowLeftRight, PiggyBank, TrendingUp, Bitcoin, Building } from "lucide-react"
import { NeobankDashboard } from "@/components/neobank/neobank-dashboard"
import Link from "next/link"

export function UnifiedBankingPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Banking & Wallet</h1>
          <p className="text-lg text-slate-600">All your financial tools in one place</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/neobank/accounts">
            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <Wallet className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-900">Accounts</h3>
              <p className="text-sm text-slate-600 mt-1">Manage your accounts</p>
            </Card>
          </Link>

          <Link href="/neobank/cards">
            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <CreditCard className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-900">Cards</h3>
              <p className="text-sm text-slate-600 mt-1">Virtual & physical cards</p>
            </Card>
          </Link>

          <Link href="/neobank/transfers">
            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <ArrowLeftRight className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-900">Transfers</h3>
              <p className="text-sm text-slate-600 mt-1">Move money easily</p>
            </Card>
          </Link>

          <Link href="/neobank/tax-buckets">
            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <PiggyBank className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-900">Tax Savings</h3>
              <p className="text-sm text-slate-600 mt-1">Automated tax buckets</p>
            </Card>
          </Link>

          <Link href="/neobank/spending">
            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-900">Spending Analytics</h3>
              <p className="text-sm text-slate-600 mt-1">Track your expenses</p>
            </Card>
          </Link>

          <Link href="/neobank/crypto">
            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <Bitcoin className="w-8 h-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-900">Crypto</h3>
              <p className="text-sm text-slate-600 mt-1">Buy & sell crypto</p>
            </Card>
          </Link>

          <Link href="/neobank/atms">
            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <Building className="w-8 h-8 text-cyan-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-slate-900">ATM Locator</h3>
              <p className="text-sm text-slate-600 mt-1">Find nearby ATMs</p>
            </Card>
          </Link>
        </div>

        {/* Main Banking Dashboard */}
        <NeobankDashboard />
      </div>
    </div>
  )
}
