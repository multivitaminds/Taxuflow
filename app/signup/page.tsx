"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGoogleSignup = async () => {
    try {
      const supabase = createClient()

      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
        ? `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/auth/callback`
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
        console.error("[v0] Google OAuth error:", error)
        setError("Google sign-in is not configured yet. Please use email signup below.")
      }
    } catch (err) {
      console.error("[v0] Google OAuth exception:", err)
      setError("Google sign-in is not available. Please use email signup below.")
    }
  }

  const handleGithubSignup = async () => {
    try {
      const supabase = createClient()

      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
        ? `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/auth/callback`
        : `${window.location.origin}/auth/callback`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error("[v0] GitHub OAuth error:", error)
        setError("GitHub sign-in is not configured yet. Please use email signup below.")
      }
    } catch (err) {
      console.error("[v0] GitHub OAuth exception:", err)
      setError("GitHub sign-in is not available. Please use email signup below.")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
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
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
            <p className="text-gray-400 mb-6">
              We've sent a confirmation link to <strong className="text-white">{email}</strong>. Click the link to
              verify your account and get started.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center px-4 py-12">
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
            <p className="text-gray-400">Start filing your taxes with AI in minutes</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold h-12 text-base mb-4 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>

          <Button
            onClick={handleGithubSignup}
            type="button"
            className="w-full bg-[#24292e] hover:bg-[#1b1f23] text-white font-semibold h-12 text-base mb-4 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1F1F1F] text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-white mb-2 block">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

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
                className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
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
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#2ACBFF] hover:underline">
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

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Join 50,000+ satisfied tax filers</p>
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
