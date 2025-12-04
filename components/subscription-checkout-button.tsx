"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionCheckoutButtonProps {
  planId: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost"
  disabled?: boolean
}

export function SubscriptionCheckoutButton({
  planId,
  children,
  className,
  variant = "default",
  disabled = false,
}: SubscriptionCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    try {
      setLoading(true)
      console.log("[v0] Starting checkout for plan:", planId)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()
      console.log("[v0] Checkout response:", data)

      if (!response.ok) {
        const errorMessage = data.details || data.error || "Failed to create checkout session"
        console.error("[v0] Checkout failed:", errorMessage)

        toast({
          title: "Checkout Failed",
          description: errorMessage,
          variant: "destructive",
        })

        setLoading(false)
        return
      }

      if (data.url) {
        console.log("[v0] Redirecting to checkout:", data.url)

        const checkoutWindow = window.open(data.url, "_blank", "noopener,noreferrer")

        if (!checkoutWindow) {
          // Popup was blocked, show instructions
          toast({
            title: "Popup Blocked",
            description: "Please allow popups for this site and try again. Or copy the checkout link.",
            variant: "destructive",
          })

          // Fallback: try direct navigation
          window.location.href = data.url
        } else {
          // Show success message that checkout opened in new tab
          toast({
            title: "Checkout Opened",
            description: "Please complete your purchase in the new tab that just opened.",
          })

          setLoading(false)
        }
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to start checkout"

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading || disabled} className={className} variant={variant}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {children}
          <ExternalLink className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
}
