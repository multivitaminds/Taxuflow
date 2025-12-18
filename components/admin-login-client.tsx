"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react'

function AdminLoginForm({ redirect }: { redirect: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      let data
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error("[v0] Non-JSON response:", text)
        setError("Server configuration error. Please ensure database scripts are run.")
        setLoading(false)
        return
      }

      if (!response.ok) {
        setError(data.error || "Invalid login credentials")
        setLoading(false)
        return
      }

      localStorage.setItem("admin_session", JSON.stringify(data.admin))
      window.location.href = redirect
    } catch (err) {
      console.error("[v0] Admin login error:", err)
      if (err instanceof SyntaxError) {
        setError("Server configuration error. Please ensure all database scripts have been run.")
      } else {
        setError("Unable to connect to server. Please check your connection.")
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Taxu Admin</h1>
          <p className="text-gray-400">Secure access to platform management</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@taxu.io"
                required
                disabled={loading}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 disabled:opacity-50"
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
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold h-12 text-base group disabled:opacity-50 shadow-lg shadow-purple-500/30"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in to Admin Panel
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 text-center">
              Not an admin?{" "}
              <Link href="https://taxu.io" className="text-purple-400 hover:text-purple-300 font-semibold">
                Go to main site
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Protected by bank-level encryption • All activity is logged</p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginClient() {
  // This will be called on the client only after Suspense resolves
  const redirect = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get("redirect") || "/admin"
    : "/admin"

  return <AdminLoginForm redirect={redirect} />
}
