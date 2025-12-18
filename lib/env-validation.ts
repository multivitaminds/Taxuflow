import { z } from "zod"

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),

  // Database
  POSTGRES_URL: z.string().url("Invalid Postgres URL").optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith("sk_", "Invalid Stripe secret key").optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_", "Invalid Stripe publishable key").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // TaxBandits
  TAXBANDITS_API_KEY: z.string().optional(),
  TAXBANDITS_API_SECRET: z.string().optional(),
  TAXBANDITS_ENVIRONMENT: z.enum(["sandbox", "production"]).optional(),

  // AWS S3
  AWS_S3_BUCKET: z.string().optional(),
  TAXBANDITS_AWS_ACCESS_KEY: z.string().optional(),
  TAXBANDITS_AWS_SECRET_KEY: z.string().optional(),

  // App Config
  NEXT_PUBLIC_APP_URL: z.string().url("Invalid app URL").optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Encryption
  ENCRYPTION_KEY: z.string().min(32, "Encryption key must be at least 32 characters").optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),

  // Blob Storage
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

let validatedEnv: Env | null = null

export function validateEnv(): Env {
  if (validatedEnv) {
    return validatedEnv
  }

  try {
    validatedEnv = envSchema.parse(process.env)
    console.log("[v0] Environment variables validated successfully")
    return validatedEnv
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[v0] Environment validation failed:")
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`)
      })
      throw new Error("Invalid environment configuration")
    }
    throw error
  }
}

export function getEnv(): Env {
  if (!validatedEnv) {
    throw new Error("Environment not validated. Call validateEnv() first.")
  }
  return validatedEnv
}

// Check which integrations are configured
export function getConfiguredIntegrations() {
  const env = process.env

  return {
    supabase: !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    stripe: !!(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    taxbandits: !!(env.TAXBANDITS_API_KEY && env.TAXBANDITS_API_SECRET),
    s3: !!(env.AWS_S3_BUCKET && env.TAXBANDITS_AWS_ACCESS_KEY && env.TAXBANDITS_AWS_SECRET_KEY),
    email: !!env.RESEND_API_KEY,
    blob: !!env.BLOB_READ_WRITE_TOKEN,
  }
}
