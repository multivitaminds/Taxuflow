import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStripeClient, isStripeConfigured } from "@/lib/stripe"
import { DEVELOPER_USAGE_PRICING, getDeveloperPlans, getPlanById } from "@/lib/subscription-plans"

// Get billing information for the current developer
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile with subscription info
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Get current subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Get usage data for current billing period
    const periodStart = subscription?.current_period_start 
      ? new Date(subscription.current_period_start)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    
    const periodEnd = subscription?.current_period_end
      ? new Date(subscription.current_period_end)
      : new Date()

    // Calculate usage metrics
    const { data: apiUsage } = await supabase
      .from("api_key_usage")
      .select("method, response_time_ms, status_code")
      .gte("created_at", periodStart.toISOString())
      .lte("created_at", periodEnd.toISOString())

    const { data: taxFilings } = await supabase
      .from("tax_filings")
      .select("id, form_type, filing_status")
      .eq("user_id", user.id)
      .gte("created_at", periodStart.toISOString())
      .lte("created_at", periodEnd.toISOString())

    const { data: w2Filings } = await supabase
      .from("w2_filings")
      .select("id")
      .eq("user_id", user.id)
      .gte("created_at", periodStart.toISOString())
      .lte("created_at", periodEnd.toISOString())

    const { data: necFilings } = await supabase
      .from("nec_1099_filings")
      .select("id")
      .eq("user_id", user.id)
      .gte("created_at", periodStart.toISOString())
      .lte("created_at", periodEnd.toISOString())

    // Calculate usage breakdown
    const readCalls = apiUsage?.filter(u => u.method === "GET").length || 0
    const writeCalls = apiUsage?.filter(u => ["POST", "PUT", "DELETE", "PATCH"].includes(u.method)).length || 0
    const federalFilings = taxFilings?.filter(f => f.form_type?.includes("federal")).length || 0
    const stateFilings = taxFilings?.filter(f => f.form_type?.includes("state")).length || 0
    const w2Count = w2Filings?.length || 0
    const nec1099Count = necFilings?.length || 0

    // Calculate costs for each category
    const usageBreakdown = {
      filings: {
        federal: { count: federalFilings, unitPrice: 2.50, total: federalFilings * 2.50 },
        state: { count: stateFilings, unitPrice: 1.50, total: stateFilings * 1.50 },
        w2: { count: w2Count, unitPrice: 1.00, total: w2Count * 1.00 },
        form1099: { count: nec1099Count, unitPrice: 1.25, total: nec1099Count * 1.25 },
      },
      api: {
        reads: { count: readCalls, unitPrice: 0.01, total: Math.ceil(readCalls / 1000) * 0.01 },
        writes: { count: writeCalls, unitPrice: 0.05, total: Math.ceil(writeCalls / 1000) * 0.05 },
      },
      compliance: {
        identityVerifications: { count: 0, unitPrice: 2.00, total: 0 },
        einValidations: { count: 0, unitPrice: 0.50, total: 0 },
      },
    }

    const subtotal = 
      usageBreakdown.filings.federal.total +
      usageBreakdown.filings.state.total +
      usageBreakdown.filings.w2.total +
      usageBreakdown.filings.form1099.total +
      usageBreakdown.api.reads.total +
      usageBreakdown.api.writes.total +
      usageBreakdown.compliance.identityVerifications.total +
      usageBreakdown.compliance.einValidations.total

    // Get payment methods from Stripe if configured
    let paymentMethods: any[] = []
    let invoices: any[] = []

    if (isStripeConfigured() && profile?.stripe_customer_id) {
      try {
        const stripe = getStripeClient()
        
        const methods = await stripe.paymentMethods.list({
          customer: profile.stripe_customer_id,
          type: "card",
        })
        paymentMethods = methods.data.map(m => ({
          id: m.id,
          brand: m.card?.brand,
          last4: m.card?.last4,
          expMonth: m.card?.exp_month,
          expYear: m.card?.exp_year,
          isDefault: m.id === subscription?.metadata?.default_payment_method,
        }))

        const stripeInvoices = await stripe.invoices.list({
          customer: profile.stripe_customer_id,
          limit: 10,
        })
        invoices = stripeInvoices.data.map(i => ({
          id: i.id,
          number: i.number,
          amount: i.amount_due / 100,
          status: i.status,
          created: i.created,
          paidAt: i.status_transitions?.paid_at,
          invoiceUrl: i.hosted_invoice_url,
          invoicePdf: i.invoice_pdf,
        }))
      } catch (e) {
        console.error("[v0] Error fetching Stripe data:", e)
      }
    }

    // Get developer plan info
    const planId = subscription?.plan_type || "developer-free"
    const plan = getPlanById(planId)

    return NextResponse.json({
      account: {
        email: user.email,
        companyName: profile?.company_name,
        accountMode: profile?.account_mode || "sandbox",
        stripeCustomerId: profile?.stripe_customer_id,
      },
      subscription: {
        id: subscription?.id,
        planId,
        planName: plan?.name || "Developer Platform",
        status: subscription?.status || "active",
        currentPeriodStart: periodStart.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAt: subscription?.cancel_at,
        features: plan?.features || [],
      },
      usage: {
        period: {
          start: periodStart.toISOString(),
          end: periodEnd.toISOString(),
        },
        breakdown: usageBreakdown,
        subtotal,
        platformFee: plan?.price || 0,
        estimatedTotal: subtotal + (plan?.price || 0),
      },
      paymentMethods,
      invoices,
      pricing: DEVELOPER_USAGE_PRICING,
      availablePlans: getDeveloperPlans(),
    })
  } catch (error) {
    console.error("[v0] Billing API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create a Stripe Checkout session for upgrading
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    const stripe = getStripeClient()
    const body = await request.json()
    const { action, planId, paymentMethodId } = body

    // Get user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("stripe_customer_id, email, company_name")
      .eq("id", user.id)
      .single()

    // Create or get Stripe customer
    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || profile?.email,
        metadata: {
          user_id: user.id,
          company_name: profile?.company_name || "",
        },
      })
      customerId = customer.id

      // Save customer ID to profile
      await supabase
        .from("user_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    if (action === "create_subscription") {
      const plan = getPlanById(planId)
      if (!plan || !plan.priceId) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan.priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          user_id: user.id,
          plan_id: planId,
        },
      })

      // Save subscription to database
      await supabase.from("subscriptions").upsert({
        user_id: user.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        plan_type: planId,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        metadata: { plan_name: plan.name },
      })

      const invoice = subscription.latest_invoice as any
      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: invoice?.payment_intent?.client_secret,
      })
    }

    if (action === "create_setup_intent") {
      // Create setup intent for adding payment method
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ["card"],
        metadata: {
          user_id: user.id,
        },
      })

      return NextResponse.json({
        clientSecret: setupIntent.client_secret,
      })
    }

    if (action === "add_payment_method" && paymentMethodId) {
      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      })

      // Set as default
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })

      return NextResponse.json({ success: true })
    }

    if (action === "cancel_subscription") {
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("stripe_subscription_id")
        .eq("user_id", user.id)
        .single()

      if (subscription?.stripe_subscription_id) {
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true,
        })

        await supabase
          .from("subscriptions")
          .update({ cancel_at: new Date().toISOString() })
          .eq("user_id", user.id)
      }

      return NextResponse.json({ success: true })
    }

    if (action === "report_usage") {
      // Report metered usage to Stripe
      const { usageData } = body
      
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("stripe_subscription_id")
        .eq("user_id", user.id)
        .single()

      if (subscription?.stripe_subscription_id) {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
        
        // Find metered items and report usage
        for (const item of stripeSubscription.items.data) {
          if (item.price.recurring?.usage_type === "metered") {
            await stripe.subscriptionItems.createUsageRecord(item.id, {
              quantity: usageData[item.price.lookup_key || ""] || 0,
              timestamp: Math.floor(Date.now() / 1000),
              action: "increment",
            })
          }
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Billing API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
