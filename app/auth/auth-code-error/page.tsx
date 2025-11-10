import Link from "next/link"
import { Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2ACBFF] to-[#0EA5E9] rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Taxu</span>
        </Link>

        <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verification Link Expired</h1>
            <p className="text-gray-400 mb-6">The email verification link has expired or is invalid.</p>
            <p className="text-sm text-gray-500 mb-6">
              Email verification links expire after 24 hours for security reasons. Please request a new verification
              email or sign up again.
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold h-12">
                  Go to Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="w-full h-12 border-white/20 text-white hover:bg-white/5 bg-transparent"
                >
                  Sign Up Again
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-[#2ACBFF] hover:text-[#0EA5E9]">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
