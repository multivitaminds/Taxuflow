"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Eye, EyeOff, ArrowRight, Check } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.cookie = "demo_mode=; path=/; max-age=0"
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("[v0] Login error:", signInError.message)

        if (signInError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Please verify your email address first.")
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      console.log("[v0] Login successful, redirecting to dashboard")

      window.location.href = "/dashboard"
    } catch (err: any) {
      console.error("[v0] Login error:", err)
      setError(err.message || "An unexpected error occurred")
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (oauthError) {
        console.error(`[v0] ${provider} OAuth error:`, oauthError.message)
        setError(`Failed to sign in with ${provider}. Please try again.`)
        setLoading(false)
        return
      }

      // OAuth redirect will happen automatically
      console.log(`[v0] Redirecting to ${provider} for authentication`)
    } catch (err: any) {
      console.error(`[v0] ${provider} OAuth error:`, err)
      setError(err.message || `Failed to sign in with ${provider}`)
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to activate demo mode")
      }

      console.log("[v0] Demo mode activated")
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("[v0] Demo login error:", err)
      setError(err instanceof Error ? err.message : "Failed to activate demo mode")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Artistic/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a2540] text-white overflow-hidden flex-col justify-between p-12">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#635BFF] to-[#00D4FF] transform -skew-y-12 origin-top-left scale-150 translate-y-1/4" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white mb-12">
            <Sparkles className="w-6 h-6" />
            <span className="text-2xl font-bold">Taxu</span>
          </Link>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            The new standard
            <br />
            in automated
            <br />
            tax filing.
          </h1>
          <p className="text-xl text-slate-300 max-w-md leading-relaxed">
            Join thousands of businesses and individuals who trust Taxu's AI agents to handle their taxes with 100%
            accuracy.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-md">
            <div className="flex gap-1 text-[#00D4FF] mb-3">
              <Check className="w-4 h-4" />
              <Check className="w-4 h-4" />
              <Check className="w-4 h-4" />
              <Check className="w-4 h-4" />
              <Check className="w-4 h-4" />
            </div>
            <p className="text-lg font-medium mb-2">
              "Taxu saved me over 40 hours this tax season. The AI agents found deductions I didn't even know existed."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-slate-300" />
              <div>
                <div className="font-bold text-sm">Sarah Jenkins</div>
                <div className="text-slate-400 text-xs">Freelance Designer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-[#635BFF]">
              <Sparkles className="w-6 h-6" />
              <span className="text-2xl font-bold">Taxu</span>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-slate-600 mt-2">
              Or{" "}
              <Link href="/signup" className="text-[#635BFF] font-medium hover:text-[#5046E5]">
                start your 14-day free trial
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                !
              </div>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-[#635BFF] hover:text-[#5046E5] font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    className="pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#635BFF] hover:bg-[#5046E5] text-white h-11 font-semibold shadow-lg shadow-[#635BFF]/20 transition-all hover:shadow-[#635BFF]/40"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                disabled={loading}
                variant="outline"
                className="h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
              >
                <img src="/images/google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
                Google
              </Button>

              <Button
                type="button"
                onClick={() => handleOAuthSignIn("github")}
                disabled={loading}
                variant="outline"
                className="h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
              >
                <img src="/images/github-logo.svg" alt="GitHub" className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>

            <Button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#635BFF] to-[#7A73FF] hover:from-[#5046E5] hover:to-[#635BFF] text-white font-bold h-11 shadow-lg shadow-[#635BFF]/30 transition-all hover:shadow-[#635BFF]/50"
            >
              Try Demo Account
            </Button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-slate-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-slate-600">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
