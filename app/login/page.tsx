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
import { Sparkles, ArrowRight, Mail, Eye, EyeOff, Zap } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const isAnyLoading = demoLoading || googleLoading || magicLinkLoading || loginLoading

  const handleDemoLogin = async () => {
    setDemoLoading(true)
    setError(null)

    try {
      // Set demo mode flag in localStorage for client-side
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

      // Set demo mode cookie for server-side access (expires in 24 hours)
      document.cookie = `demo_mode=true; path=/; max-age=86400; SameSite=Lax`

      console.log("[v0] Demo mode activated, redirecting to dashboard")

      window.location.href = "/dashboard"
    } catch (err) {
      console.error("[v0] Demo mode error:", err)
      setError("Failed to activate demo mode. Please try again.")
      setDemoLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        : `${window.location.origin}/auth/callback`

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
        console.error("[v0] Google login error:", error.message)
        setError(error.message)
        setGoogleLoading(false)
      }
      // Note: If successful, user will be redirected, so no need to reset loading
    } catch (err) {
      console.error("[v0] Google login error:", err)
      setError("Failed to sign in with Google. Please try again.")
      setGoogleLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setMagicLinkLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        console.error("[v0] Magic link error:", error.message)
        setError(error.message)
        setMagicLinkLoading(false)
      } else {
        setMagicLinkSent(true)
        setMagicLinkLoading(false)
      }
    } catch (err) {
      console.error("[v0] Magic link error:", err)
      setError("Failed to send magic link. Please try again.")
      setMagicLinkLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()

      localStorage.removeItem("demo_mode")
      localStorage.removeItem("demo_user")
      document.cookie = "demo_mode=; path=/; max-age=0; SameSite=Lax"

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error.message)
        if (error.message.includes("Email not confirmed")) {
          setError("Please confirm your email address before signing in. Check your inbox for the confirmation link.")
        } else if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else {
          setError(error.message)
        }
        setLoginLoading(false)
      } else {
        if (rememberMe) {
          localStorage.setItem("taxu_remember_me", "true")
        } else {
          localStorage.removeItem("taxu_remember_me")
        }

        console.log("[v0] Login successful, redirecting to dashboard")
        window.location.href = "/dashboard"
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoginLoading(false)
    }
  }

  if (magicLinkSent) {
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
              We sent a magic link to <strong className="text-white">{email}</strong>. Click the link to sign in
              instantly.
            </p>
            <Button onClick={() => setMagicLinkSent(false)} variant="outline" className="w-full">
              Back to login
            </Button>
          </div>
        </div>
      </div>
    )
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

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <Button
              type="button"
              onClick={handleDemoLogin}
              disabled={isAnyLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold h-12 text-base shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {demoLoading ? "Loading Demo..." : "🚀 Try Demo Account - Instant Access"}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">
              <span className="text-green-400 font-semibold">No signup or email required</span> • Explore all features
              with sample data
            </p>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isAnyLoading}
            variant="outline"
            className="w-full h-12 mb-4 bg-white hover:bg-gray-100 text-gray-900 border-white/20 disabled:opacity-50"
          >
            {googleLoading ? (
              "Connecting..."
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77C17.45 20.53 14.97 23 12 23 7.7 23 3.99 20.53 2.18 16.93l2.85-2.22.81-.62z"
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
              </>
            )}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1F1F1F] text-gray-500">Or sign in with your account</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                disabled={isAnyLoading}
                className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500 disabled:opacity-50"
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isAnyLoading}
                  className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isAnyLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isAnyLoading}
                className="border-white/20 data-[state=checked]:bg-[#2ACBFF] data-[state=checked]:border-[#2ACBFF] disabled:opacity-50"
              />
              <Label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer select-none">
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isAnyLoading}
              className="w-full bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold h-12 text-base group disabled:opacity-50"
            >
              {loginLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={handleMagicLink}
              disabled={isAnyLoading || !email}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 mr-2" />
              {magicLinkLoading ? "Sending..." : "Send magic link instead"}
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
