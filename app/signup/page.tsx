"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", email).single()

      if (existingUser) {
        setError("This email is already registered. Please sign in instead or reset your password if you forgot it.")
        setLoading(false)
        return
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        console.log("[v0] Signup error:", signUpError.message)

        if (
          signUpError.message.includes("already registered") ||
          signUpError.message.includes("User already registered")
        ) {
          setError("This email is already registered. Please sign in instead or reset your password if you forgot it.")
        } else if (signUpError.message.includes("Email not confirmed")) {
          setError("Your email hasn't been confirmed yet. Please check your inbox for the confirmation link.")
        } else if (signUpError.message.includes("Invalid email")) {
          setError("Please enter a valid email address.")
        } else if (signUpError.message.includes("Password")) {
          setError("Password must be at least 6 characters long.")
        } else {
          setError(signUpError.message || "Failed to create account. Please try again.")
        }
        setLoading(false)
        return
      }

      if (signUpData?.user && !signUpData.session) {
        // Email confirmation required
        console.log("[v0] Signup successful - email confirmation required")
        setSuccess(true)
      } else if (signUpData?.session) {
        // User is immediately logged in (email confirmation disabled)
        console.log("[v0] Signup successful - user logged in immediately")
        router.push("/dashboard")
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      console.log("[v0] Signup exception:", err.message)
      setError(err.message || "Failed to create account. Please try again.")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: "google" | "github") => {
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
        setError(`Failed to sign up with ${provider}. Please try again.`)
        setLoading(false)
        return
      }

      // OAuth redirect will happen automatically
      console.log(`[v0] Redirecting to ${provider} for authentication`)
    } catch (err: any) {
      console.error(`[v0] ${provider} OAuth error:`, err)
      setError(err.message || `Failed to sign up with ${provider}`)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 pt-24">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#635BFF] to-[#7C66FF] rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Taxu</span>
          </Link>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
            <p className="text-gray-600 mb-6">
              We sent a confirmation link to <strong className="text-gray-900">{email}</strong>. Click the link to
              verify your email and start using Taxu.
            </p>
            <Button onClick={() => router.push("/login")} className="w-full bg-[#635BFF] hover:bg-[#5046E5]">
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 pt-24">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#635BFF] to-[#7C66FF] rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Taxu</span>
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Get started with Taxu today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <Button
              type="button"
              onClick={() => handleOAuthSignUp("google")}
              disabled={loading}
              variant="outline"
              className="w-full border-2 flex items-center justify-center gap-2"
            >
              <img src="/images/google-logo.png" alt="Google" className="w-5 h-5" />
              {loading ? "Signing up..." : "Continue with Google"}
            </Button>

            <Button
              type="button"
              onClick={() => handleOAuthSignUp("github")}
              disabled={loading}
              variant="outline"
              className="w-full border-2 flex items-center justify-center gap-2"
            >
              <img src="/images/github-logo.svg" alt="GitHub" className="w-5 h-5" />
              {loading ? "Signing up..." : "Continue with GitHub"}
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#635BFF] hover:bg-[#5046E5] text-white">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#635BFF] hover:text-[#5046E5] font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
