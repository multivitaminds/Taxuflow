"use client"

import { Shield, Info } from "lucide-react"

export default function VaultPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Taxu Vault</h1>
        <p className="text-sm text-slate-600 mt-1">Secure your funds and optimize returns</p>
      </div>

      {/* FDIC Insurance */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">FDIC Insurance</h2>
            <p className="text-sm text-slate-600">Up to $60M</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Checking/Savings Balance</h3>
            <div className="text-3xl font-bold text-slate-900">$5,000,000.00</div>
            <p className="text-sm text-slate-600 mt-1">Up to $60M FDIC insured</p>
          </div>
        </div>
      </div>

      {/* Treasury */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900">Treasury</h2>
            <span className="text-sm text-slate-600">Transfer in Progress</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Taxu Treasury earns yield and keeps your funds secure with low-risk, short-term investments
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Treasury Balance</h3>
            <div className="text-3xl font-bold text-slate-900">$231,764.10</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">• 25% J.P. Morgan</span>
              <span className="font-medium text-slate-900">$57,941.03</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">• 75% Morgan Stanley</span>
              <span className="font-medium text-slate-900">$173,823.08</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Taxu Vault */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">About Taxu Vault</h2>
        <p className="text-sm text-slate-600 mb-4">
          Taxu Vault helps startups of any size and scale manage bank risk and protect your funds.
        </p>
        <a href="#" className="text-sm text-[#635bff] hover:underline inline-flex items-center gap-1">
          Learn More →
        </a>
      </div>

      {/* Disclaimers */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 space-y-2">
            <p>
              * Taxu is a fintech company, not an FDIC-insured bank. Checking and savings accounts are provided through
              our bank partners Choice Financial Group, Column N.A., and Evolve Bank & Trust, Members FDIC.
            </p>
            <p>
              Taxu Treasury is offered by Taxu Advisory, LLC, an SEC-registered investment adviser. This communication
              does not constitute an offer to sell or the solicitation of any offer to purchase any security. Funds in
              Taxu Treasury are subject to investment risks, including possible loss of the principal invested, and past
              performance is not guarantee of future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
