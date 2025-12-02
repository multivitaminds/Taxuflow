"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface AddOnCheckoutButtonProps {
  addOnId: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost"
  disabled?: boolean
  size?: "default" | "sm" | "lg" | "icon"
}

export function AddOnCheckoutButton({
  addOnId,
  children,
  className,
  variant = "default",
  disabled = false,
  size = "default",
}: AddOnCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Starting add-on checkout for:", addOnId)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addOnId }),
      })

      const data = await response.json()
      console.log("[v0] Add-on checkout response:", data)

      if (!response.ok) {
        const errorMessage = data.details || data.error || "Failed to create checkout session"
        console.error("[v0] Add-on checkout failed:", errorMessage)
        setError(errorMessage)
        alert(`Checkout failed: ${errorMessage}`)
        setLoading(false)
        return
      }

      if (data.url) {
        console.log("[v0] Redirecting to checkout:", data.url)
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("[v0] Add-on checkout error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to start checkout"
      setError(errorMessage)
      alert(`Failed to start checkout: ${errorMessage}`)
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading || disabled} className={className} variant={variant} size={size}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
