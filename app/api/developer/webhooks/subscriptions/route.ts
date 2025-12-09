import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's webhooks
    const { data: webhooks } = await supabase.from("webhooks").select("id").eq("user_id", user.id)

    if (!webhooks || webhooks.length === 0) {
      return NextResponse.json({ subscriptions: [] })
    }

    const webhookIds = webhooks.map((w) => w.id)

    // Fetch subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from("webhook_subscriptions")
      .select("*")
      .in("webhook_id", webhookIds)
      .order("created_at", { ascending: false })

    if (subsError) {
      console.error("[v0] Error fetching subscriptions:", subsError)
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("[v0] Error in subscriptions route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { webhook_id, event_type } = body

    // Verify webhook ownership
    const { data: webhook } = await supabase
      .from("webhooks")
      .select("id")
      .eq("id", webhook_id)
      .eq("user_id", user.id)
      .single()

    if (!webhook) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 })
    }

    // Create subscription
    const { data: subscription, error: createError } = await supabase
      .from("webhook_subscriptions")
      .insert({
        webhook_id,
        event_type,
        is_active: true,
      })
      .select()
      .single()

    if (createError) {
      console.error("[v0] Error creating subscription:", createError)
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("[v0] Error in create subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { subscription_id, is_active } = body

    if (!subscription_id || typeof is_active !== "boolean") {
      return NextResponse.json({ error: "Subscription ID and is_active required" }, { status: 400 })
    }

    // Verify ownership through webhook
    const { data: subscription } = await supabase
      .from("webhook_subscriptions")
      .select("*, webhooks!inner(user_id)")
      .eq("id", subscription_id)
      .single()

    if (!subscription || subscription.webhooks.user_id !== user.id) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Update subscription
    const { data: updated, error: updateError } = await supabase
      .from("webhook_subscriptions")
      .update({ is_active })
      .eq("id", subscription_id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Error updating subscription:", updateError)
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
    }

    return NextResponse.json({ subscription: updated })
  } catch (error) {
    console.error("[v0] Error in update subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subscription_id = searchParams.get("id")

    if (!subscription_id) {
      return NextResponse.json({ error: "Subscription ID required" }, { status: 400 })
    }

    // Verify ownership through webhook
    const { data: subscription } = await supabase
      .from("webhook_subscriptions")
      .select("*, webhooks!inner(user_id)")
      .eq("id", subscription_id)
      .single()

    if (!subscription || subscription.webhooks.user_id !== user.id) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Delete subscription
    const { error: deleteError } = await supabase.from("webhook_subscriptions").delete().eq("id", subscription_id)

    if (deleteError) {
      console.error("[v0] Error deleting subscription:", deleteError)
      return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Subscription deleted" })
  } catch (error) {
    console.error("[v0] Error in delete subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
