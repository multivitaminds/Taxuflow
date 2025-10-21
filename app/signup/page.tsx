"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2, X } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: "", color: "" }
    if (pwd.length < 6) return { strength: 1, label: "Too short", color: "text-red-400" }
    if (pwd.length < 8) return { strength: 2, label: "Weak", color: "text-orange-400" }

    let strength = 2
    if (pwd.length >= 10) strength++
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    if (strength >= 5) return { strength: 4, label: "Strong", color: "text-green-400" }
    if (strength >= 4) return { strength: 3, label: "Good", color: "text-blue-400" }
    return { strength: 2, label: "Fair", color: "text-yellow-400" }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const redirectUrl = `${window.location.origin}/auth/callback`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        console.error("[v0] Google signup error:", error.message)
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      console.error("[v0] Google signup error:", err)
      setError("Failed to sign up with Google. Please try again.")
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    localStorage.removeItem("demo_mode")
    localStorage.removeItem("demo_user")
    document.cookie = "demo_mode=; path=/; max-age=0; SameSite=Lax"

    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        // Skip email confirmation in development
        data: {
          email_confirmed: true,
        },
      },
    })

    if (error) {
      console.error("[v0] Signup error:", error.message)
      setError(error.message)
      setLoading(false)
    } else {
      console.log("[v0] Signup successful:", data)
      // Redirect immediately to dashboard
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2ACBFF] to-[#0EA5E9] rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Taxu</span>
        </Link>

        <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-gray-400">Get started in seconds</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            variant="outline"
            className="w-full h-12 mb-4 bg-white hover:bg-gray-100 text-gray-900 border-white/20"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1F1F1F] text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500 h-12"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500 h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.strength === 1
                            ? "w-1/4 bg-red-500"
                            : passwordStrength.strength === 2
                              ? "w-2/4 bg-yellow-500"
                              : passwordStrength.strength === 3
                                ? "w-3/4 bg-blue-500"
                                : "w-full bg-green-500"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div
                      className={`flex items-center gap-2 ${password.length >= 8 ? "text-green-400" : "text-gray-500"}`}
                    >
                      {password.length >= 8 ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>At least 8 characters</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 ${/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-green-400" : "text-gray-500"}`}
                    >
                      {/[A-Z]/.test(password) && /[a-z]/.test(password) ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                      <span>Upper & lowercase letters</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 ${/[0-9]/.test(password) ? "text-green-400" : "text-gray-500"}`}
                    >
                      {/[0-9]/.test(password) ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>At least one number</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || passwordStrength.strength < 2}
              className="w-full bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold h-12 text-base group"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center mb-4">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-[#2ACBFF] hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#2ACBFF] hover:text-[#0EA5E9] font-semibold transition-colors">
                Privacy Policy
              </Link>
            </p>
            <p className="text-gray-400 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[#2ACBFF] hover:text-[#0EA5E9] font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-600">
          <span>🔒 Secure</span>
          <span>✓ IRS-approved</span>
          <span>⚡ Instant access</span>
        </div>
      </div>
    </div>
  )
}
