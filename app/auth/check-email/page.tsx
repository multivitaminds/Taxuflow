"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sparkles, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2ACBFF] to-[#0EA5E9] rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Taxu</span>
        </Link>

        <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-green-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Check your email</h1>

          <p className="text-gray-400 mb-2">We've sent a confirmation link to:</p>

          {email && <p className="text-[#2ACBFF] font-semibold mb-6">{email}</p>}

          <p className="text-gray-400 mb-8">
            Click the link in the email to confirm your account and complete your signup.
          </p>

          <div className="space-y-4">
            <Button asChild className="w-full bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold h-12">
              <Link href="/login">Go to Sign In</Link>
            </Button>

            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{" "}
              <Link href="/signup" className="text-[#2ACBFF] hover:text-[#0EA5E9]">
                try signing up again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
