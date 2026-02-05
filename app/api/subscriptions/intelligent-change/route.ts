import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { SUBSCRIPTION_PLANS, type SubscriptionTier, type UserType } from "@/lib/subscription-tiers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { newTier, billingPeriod, userType } = await request.json()

    // Get current subscription
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("subscription_tier, stripe_customer_id, stripe_subscription_id, user_type")
      .eq("user_id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const currentTier = profile.subscription_tier as SubscriptionTier
    const effectiveUserType = (userType || profile.user_type || "individual") as UserType

    // Validate tier change
    if (!isValidTierChange(currentTier, newTier)) {
      return NextResponse.json(
        {
          error: "Invalid tier change",
          message: "Please contact support for this tier change",
        },
        { status: 400 },
      )
    }

    // Get the new plan details
    const newPlan = SUBSCRIPTION_PLANS[newTier as SubscriptionTier]
    const newPrice =
      billingPeriod === "annual" ? newPlan.price[effectiveUserType].annual : newPlan.price[effectiveUserType].monthly

    // If downgrading or same price, handle immediately
    const isDowngrade = getTierRank(newTier) < getTierRank(currentTier)
    const isFree = newTier === "free"

    if (isFree || isDowngrade) {
      // Cancel current subscription at period end
      if (profile.stripe_subscription_id) {
        await stripe.subscriptions.update(profile.stripe_subscription_id, {
          cancel_at_period_end: true,
          metadata: {
            scheduled_tier: newTier,
            scheduled_at: new Date().toISOString(),
          },
        })

        return NextResponse.json({
          success: true,
          message: `Your subscription will downgrade to ${newPlan.name} at the end of your current billing period.`,
          effectiveDate: await getSubscriptionEndDate(profile.stripe_subscription_id),
        })
      }
    }

    // Handle upgrades with prorated billing
    if (!isDowngrade && newPrice > 0) {
      let subscriptionId = profile.stripe_subscription_id

      // Create Stripe customer if doesn't exist
      let customerId = profile.stripe_customer_id
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            user_id: user.id,
            user_type: effectiveUserType,
          },
        })
        customerId = customer.id

        await supabase.from("user_profiles").update({ stripe_customer_id: customerId }).eq("user_id", user.id)
      }

      // Get price ID
      const priceId = newPlan.stripePriceIds[effectiveUserType][billingPeriod]

      if (subscriptionId) {
        // Update existing subscription with proration
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        await stripe.subscriptions.update(subscriptionId, {
          items: [
            {
              id: subscription.items.data[0].id,
              price: priceId,
            },
          ],
          proration_behavior: "always_invoice", // Charge immediately for upgrade
          metadata: {
            tier: newTier,
            user_type: effectiveUserType,
            upgraded_at: new Date().toISOString(),
          },
        })
      } else {
        // Create new subscription
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          metadata: {
            user_id: user.id,
            tier: newTier,
            user_type: effectiveUserType,
          },
        })
        subscriptionId = subscription.id
      }

      // Update database immediately for upgrades
      await supabase
        .from("user_profiles")
        .update({
          subscription_tier: newTier,
          stripe_subscription_id: subscriptionId,
          user_type: effectiveUserType,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      // Log the change
      await supabase.from("subscription_changes").insert({
        user_id: user.id,
        from_tier: currentTier,
        to_tier: newTier,
        change_type: "upgrade",
        billing_period: billingPeriod,
        user_type: effectiveUserType,
        created_at: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        message: `Successfully upgraded to ${newPlan.name}!`,
        subscriptionId,
        prorated: true,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
    })
  } catch (error: any) {
    console.error("[v0] Subscription change error:", error)
    return NextResponse.json({ error: "Failed to change subscription", details: error.message }, { status: 500 })
  }
}

function getTierRank(tier: string): number {
  const ranks = { free: 0, essential: 1, professional: 2, business: 3, enterprise: 4 }
  return ranks[tier as keyof typeof ranks] || 0
}

function isValidTierChange(from: string, to: string): boolean {
  // Allow all changes except enterprise downgrades (require support)
  if (from === "enterprise" && getTierRank(to) < getTierRank(from)) {
    return false
  }
  return true
}

async function getSubscriptionEndDate(subscriptionId: string): Promise<string> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return new Date(subscription.current_period_end * 1000).toISOString()
}
