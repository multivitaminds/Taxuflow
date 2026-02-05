import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!stripeInstance) {
      const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.taxu_STRIPE_SECRET_KEY
      if (!stripeKey) {
        throw new Error("STRIPE_SECRET_KEY is not set")
      }
      stripeInstance = new Stripe(stripeKey, {
        apiVersion: "2024-11-20.acacia",
        typescript: true,
      })
    }
    return (stripeInstance as any)[prop]
  },
})
