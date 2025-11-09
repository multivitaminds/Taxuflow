"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    if (errorParam) {
      if (errorDescription) {
        const decodedError = decodeURIComponent(errorDescription)
        if (decodedError.includes("Database error saving new user")) {
          setError("Authentication failed. Please try again or use email/password login.")
        } else {
          setError(decodedError)
        }
      } else {
        setError(decodeURIComponent(errorParam))
      }

      const url = new URL(window.location.href)
      url.searchParams.delete("error")
      url.searchParams.delete("error_description")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams])

  const handleDemoLogin = async () => {
    setLoading(true)
    setError(null)

    try {
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

      window.location.href = "/dashboard"
    } catch (err) {
      setError("Failed to activate demo mode. Please try again.")
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) throw error
      // Note: The redirect happens automatically, so no manual redirect needed here
    } catch (err: any) {
      console.log("[v0] Google OAuth error:", err)
      setError(err.message || "Failed to sign in with Google")
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Environment check:", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      })

      const supabase = createClient()

      if (!supabase) {
        console.error("[v0] Supabase client is null - environment variables missing")
        throw new Error("Authentication service is not configured. Please contact support.")
      }

      console.log("[v0] Login attempt:", { email })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Login response:", {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        error: error?.message,
      })

      if (error) {
        console.error("[v0] Login error:", {
          message: error.message,
          status: error.status,
          name: error.name,
        })

        if (error.message === "Invalid login credentials") {
          throw new Error("Invalid email or password. Don't have an account yet? Sign up to get started.")
        }

        throw error
      }

      if (data?.session) {
        console.log("[v0] Login successful, session created")
        router.push("/dashboard")
      } else {
        throw new Error("No session returned from login")
      }
    } catch (err: any) {
      console.error("[v0] Login failed:", err.message)
      setError(err.message || "Invalid email or password")
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error
      setMagicLinkSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send magic link")
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center px-4 pt-24">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2ACBFF] to-[#0EA5E9] rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Taxu</span>
          </Link>

          <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#2ACBFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-[#2ACBFF]" />
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
    <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center px-4 pt-24">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2ACBFF] to-[#0EA5E9] rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Taxu</span>
        </Link>

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
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold h-12 text-base shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {loading ? "Loading Demo..." : "🚀 Try Demo Account - Instant Access"}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">
              <span className="text-green-400 font-semibold">No signup or email required</span> • Explore all features
              with sample data
            </p>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="outline"
            className="w-full h-12 mb-4 bg-white hover:bg-gray-100 text-gray-900 border-white/20 disabled:opacity-50"
          >
            {loading ? (
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
              <span className="px-4 bg-[#1F1F1F] text-gray-500">Or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                disabled={loading}
                className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500 h-12"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm text-[#2ACBFF] hover:text-[#0EA5E9]">
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
                  disabled={loading}
                  className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500 h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold h-12 group"
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
              <Link href="/signup" className="text-[#2ACBFF] hover:text-[#0EA5E9] font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
