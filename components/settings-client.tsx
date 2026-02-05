"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2, LogOut, RefreshCw } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { updateProfile } from "@/app/actions/update-profile"

interface SettingsClientProps {
  user: User
  profile: any
}

export function SettingsClient({ user, profile }: SettingsClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [email, setEmail] = useState(user.email || "")
  const [loading, setLoading] = useState(false)
  const [nameLoading, setNameLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Sign out failed")
      }

      // Clear client-side storage
      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
      }

      // Force full page reload to clear all state and cookies
      window.location.href = "/login"
    } catch (error) {
      console.error("[v0] Sign out error:", error)
      // Clear client-side storage
      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
      }
      // Force redirect even on error to ensure user is logged out
      window.location.href = "/login"
    }
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameLoading(true)
    setNameError(null)
    setNameSuccess(false)

    try {
      const result = await updateProfile(fullName)

      if (result.error) {
        throw new Error(result.error)
      }

      setNameSuccess(true)
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error("[v0] Error updating name:", err)
      setNameError(err.message || "Failed to update name")
    } finally {
      setNameLoading(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: email,
      })

      if (updateError) throw updateError

      setSuccess(true)
    } catch (err: any) {
      console.error("[v0] Error updating email:", err)
      setError(err.message || "Failed to update email")
    } finally {
      setLoading(false)
    }
  }

  const handleSyncSubscription = async () => {
    setSyncing(true)
    setError(null)

    try {
      const response = await fetch("/api/sync-subscription", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sync subscription")
      }

      console.log("[v0] Subscription synced:", data)
      setSuccess(true)

      // Refresh the page to show updated subscription
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error("[v0] Sync error:", err)
      setError(err.message || "Failed to sync subscription")
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="space-y-6">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold mb-4">Full Name</h2>

            {nameError && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{nameError}</p>
              </div>
            )}

            {nameSuccess && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-500">Name updated successfully!</p>
              </div>
            )}

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This name will appear throughout the app and on your tax documents
                </p>
              </div>
              <Button
                type="submit"
                disabled={nameLoading || fullName === profile?.full_name || !fullName.trim()}
                className="bg-neon hover:bg-neon/90 text-background"
              >
                {nameLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Name
                  </>
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold mb-4">Email Address</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-500">Email updated! Check your inbox to confirm the change.</p>
              </div>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || email === user.email}
                className="bg-neon hover:bg-neon/90 text-background"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Email
                  </>
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold mb-4">Subscription</h2>
            <p className="text-muted-foreground mb-4">
              Current plan: <span className="font-semibold">{profile?.subscription_tier || "Free"}</span>
            </p>
            <div className="flex gap-3">
              <Button onClick={() => router.push("/dashboard/subscription")} variant="outline">
                Manage Subscription
              </Button>
              <Button onClick={handleSyncSubscription} variant="outline" disabled={syncing}>
                {syncing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Subscription
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold mb-4">Account Actions</h2>
            <p className="text-muted-foreground mb-4">Manage your session and account access</p>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="text-red-500 hover:bg-red-500/10 hover:text-red-600 border-red-200 dark:border-red-900/30 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
