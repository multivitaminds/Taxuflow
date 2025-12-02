"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ActivateAccountClientProps {
  user: any
  profile: any
}

export function ActivateAccountClient({ user, profile }: ActivateAccountClientProps) {
  const router = useRouter()
  const [isActivating, setIsActivating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDemoMode = profile?.user_type === "demo" || profile?.subscription_tier === "free"

  const handleActivate = async () => {
    setIsActivating(true)
    setError(null)

    try {
      const response = await fetch("/api/activate-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to activate account")
      }

      localStorage.setItem("account_activation_time", Date.now().toString())

      // Redirect to dashboard with success message
      router.push("/dashboard?activated=true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsActivating(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Activate Your Live Account</CardTitle>
          <CardDescription>
            Switch from demo mode to a live account with real data and all features unlocked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isDemoMode ? (
            <>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Activating your account will reset all demo data. All test entries,
                  documents, and configurations will be removed, and you'll start with a fresh account.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-semibold">What happens when you activate:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    All demo data will be cleared
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Fresh account with zero balances
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Access to all premium features based on subscription
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Ready for real tax filing and accounting
                  </li>
                </ul>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button onClick={handleActivate} disabled={isActivating} size="lg" className="flex-1">
                  {isActivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Activate Live Account
                </Button>
                <Button variant="outline" onClick={() => router.back()} disabled={isActivating}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Your account is already activated and running in live mode. You can start using all features with real
                data.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
