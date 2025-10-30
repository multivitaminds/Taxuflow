import Link from "next/link"
import { Sparkles, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2ACBFF] to-[#0EA5E9] rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Taxu</span>
        </Link>

        <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[#2ACBFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-[#2ACBFF]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
          <p className="text-gray-400 mb-6">
            We've sent you a confirmation email. Click the link in the email to verify your account and get started.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full bg-transparent">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
