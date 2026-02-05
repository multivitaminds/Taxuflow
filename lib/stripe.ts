import Stripe from "stripe"

// Lazy-load Stripe to avoid build-time initialization errors
let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (_stripe) return _stripe
  
  const key = process.env.STRIPE_SECRET_KEY || process.env.taxu_STRIPE_SECRET_KEY
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY or taxu_STRIPE_SECRET_KEY is not set")
  }
  
  _stripe = new Stripe(key, {
    apiVersion: "2024-11-20.acacia",
    typescript: true,
  })
  
  return _stripe
}

// Export a Proxy that defers initialization until first use
export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    const stripeInstance = getStripe()
    const value = (stripeInstance as any)[prop]
    return typeof value === "function" ? value.bind(stripeInstance) : value
  },
})
