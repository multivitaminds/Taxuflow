import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export interface PaymentLinkOptions {
  invoiceId: string
  amount: number
  currency?: string
  description: string
  customerEmail?: string
  metadata?: Record<string, string>
}

/**
 * Create a Stripe payment link for an invoice
 */
export async function createInvoicePaymentLink(options: PaymentLinkOptions): Promise<string> {
  try {
    // Create a price for this specific invoice
    const price = await stripe.prices.create({
      unit_amount: Math.round(options.amount * 100), // Convert to cents
      currency: options.currency || "usd",
      product_data: {
        name: options.description,
      },
    })

    // Create payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        invoice_id: options.invoiceId,
        ...options.metadata,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/accounting/invoices?payment=success&invoice=${options.invoiceId}`,
        },
      },
    })

    return paymentLink.url
  } catch (error) {
    console.error("[v0] Error creating payment link:", error)
    throw new Error("Failed to create payment link")
  }
}

/**
 * Create a checkout session for invoice payment
 */
export async function createCheckoutSession(options: PaymentLinkOptions): Promise<string> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: options.currency || "usd",
            product_data: {
              name: options.description,
            },
            unit_amount: Math.round(options.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/accounting/invoices?payment=success&invoice=${options.invoiceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/accounting/invoices?payment=cancelled`,
      customer_email: options.customerEmail,
      metadata: {
        invoice_id: options.invoiceId,
        ...options.metadata,
      },
    })

    return session.url!
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

/**
 * Verify payment webhook from Stripe
 */
export async function verifyWebhook(payload: string, signature: string): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    console.error("[v0] Webhook verification failed:", error)
    throw new Error("Invalid webhook signature")
  }
}
