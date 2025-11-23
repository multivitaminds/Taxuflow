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
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.43-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
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
                className="h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            <Button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              variant="ghost"
              className="w-full text-slate-500 hover:text-[#635BFF] font-medium"
            >
              🚀 Try Demo Account
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
