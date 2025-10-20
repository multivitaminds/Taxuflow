"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, ArrowRight, AlertCircle, Info, Mail, CheckCircle, Github } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [emailResent, setEmailResent] = useState(false)

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError(null)

    localStorage.setItem("demo_mode", "true")
    localStorage.setItem(
      "demo_user",
      JSON.stringify({
        id: "demo-user-id",
        email: "demo@example.com",
        full_name: "Demo User",
        created_at: new Date().toISOString(),
      }),
    )

    document.cookie = `demo_mode=true; path=/; max-age=86400; SameSite=Lax`

    router.push("/dashboard")
    router.refresh()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setNeedsEmailConfirmation(false)
    setEmailResent(false)

    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setNeedsEmailConfirmation(true)
      } else if (error.message.includes("Invalid login credentials")) {
        setError(
          "Invalid email or password. Please check your credentials and try again, or sign up if you don't have an account yet.",
        )
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      if (rememberMe) {
        localStorage.setItem("taxu_remember_me", "true")
      } else {
        localStorage.removeItem("taxu_remember_me")
      }

      localStorage.removeItem("demo_mode")
      localStorage.removeItem("demo_user")
      document.cookie = "demo_mode=; path=/; max-age=0; SameSite=Lax"

      router.push("/dashboard")
      router.refresh()
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setResendingEmail(true)
    setError(null)

    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    setResendingEmail(false)

    if (error) {
      setError("Failed to resend confirmation email. Please try again.")
    } else {
      setEmailResent(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2ACBFF] to-[#0EA5E9] rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Taxu</span>
        </Link>

        {/* Login Card */}
        <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to your Taxu account</p>
          </div>

          <div className="mb-6">
            <Button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold h-12 text-base shadow-lg shadow-purple-500/20"
            >
              {loading ? "Loading Demo..." : "🚀 Try Demo Account - Instant Access"}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">
              <span className="text-green-400 font-semibold">No signup or email required</span> • Explore all features
              with sample data
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1F1F1F] text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              disabled={loading}
              variant="outline"
              className="bg-[#0B0C0E] border-white/10 text-white hover:bg-white/5 h-12"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              onClick={() => handleOAuthSignIn("github")}
              disabled={loading}
              variant="outline"
              className="bg-[#0B0C0E] border-white/10 text-white hover:bg-white/5 h-12"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1F1F1F] text-gray-500">Or sign in with email</span>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-[#2ACBFF]/10 to-[#0EA5E9]/10 border border-[#2ACBFF]/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#2ACBFF] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#2ACBFF] mb-1">First time here?</p>
                <p className="text-xs text-gray-400 mb-3">
                  Create a free account in seconds. Upload tax documents and see our 5 AI agents analyze your taxes
                  instantly!
                </p>
                <Link href="/signup">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {needsEmailConfirmation && (
            <div className="mb-6 p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-xl shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-blue-400 mb-2">📬 Check Your Email</p>
                  <p className="text-sm text-white mb-3 leading-relaxed">
                    We sent a confirmation link to verify your account. Click the link in the email to activate your
                    account and sign in.
                  </p>
                  {email && (
                    <>
                      <div className="bg-[#0B0C0E] border border-blue-500/20 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-400 mb-1">Confirmation email sent to:</p>
                        <p className="text-sm font-semibold text-white">{email}</p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">1.</span>
                          <p className="text-xs text-gray-300">Open your email inbox (check spam/junk folder too)</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">2.</span>
                          <p className="text-xs text-gray-300">
                            Look for an email from Taxu with subject "Confirm your email"
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">3.</span>
                          <p className="text-xs text-gray-300">Click the confirmation link in the email</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">4.</span>
                          <p className="text-xs text-gray-300">Return here and sign in with your credentials</p>
                        </div>
                      </div>
                      {emailResent ? (
                        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-sm text-green-400 font-semibold">
                            ✓ Confirmation email sent! Check your inbox.
                          </span>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleResendConfirmation}
                          disabled={resendingEmail}
                          variant="outline"
                          size="sm"
                          className="w-full bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 mb-3 font-semibold"
                        >
                          {resendingEmail ? "Sending..." : "📨 Didn't receive it? Resend confirmation email"}
                        </Button>
                      )}
                    </>
                  )}
                  <div className="border-t border-blue-500/20 pt-4 mt-4">
                    <p className="text-xs text-gray-400 mb-2 font-semibold">⚡ Want instant access?</p>
                    <Button
                      type="button"
                      onClick={handleDemoLogin}
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg"
                    >
                      🚀 Try Demo Account (No Email Confirmation Needed)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && !needsEmailConfirmation && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-400 mb-2">{error}</p>
                  <Link href="/signup">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      Create an account instead
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm text-[#2ACBFF] hover:text-[#0EA5E9] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-white/20 data-[state=checked]:bg-[#2ACBFF] data-[state=checked]:border-[#2ACBFF]"
              />
              <Label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer select-none">
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold h-12 text-base group"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#2ACBFF] hover:text-[#0EA5E9] font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by 50,000+ tax filers</p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <span>🔒 Bank-level encryption</span>
            <span>✓ IRS-approved</span>
            <span>⚡ Instant refunds</span>
          </div>
        </div>
      </div>
    </div>
  )
}
