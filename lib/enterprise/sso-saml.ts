import { createServerClient } from "@/lib/supabase/server"

export interface SAMLConfig {
  organizationId: string
  provider: "okta" | "azure" | "google" | "onelogin" | "custom"
  enabled: boolean
  entryPoint: string
  issuer: string
  cert: string
  audienceRestriction?: string
  identifierFormat?: string
}

/**
 * Configure SAML SSO for organization
 */
export async function configureSAML(config: SAMLConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase.from("sso_configurations").upsert({
      organization_id: config.organizationId,
      provider: config.provider,
      enabled: config.enabled,
      config: {
        entryPoint: config.entryPoint,
        issuer: config.issuer,
        cert: config.cert,
        audienceRestriction: config.audienceRestriction,
        identifierFormat: config.identifierFormat || "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Error configuring SAML:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in configureSAML:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Get SSO configuration for organization
 */
export async function getSSOConfig(organizationId: string): Promise<SAMLConfig | null> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("sso_configurations")
      .select("*")
      .eq("organization_id", organizationId)
      .single()

    if (error || !data) {
      return null
    }

    return {
      organizationId: data.organization_id,
      provider: data.provider,
      enabled: data.enabled,
      entryPoint: data.config.entryPoint,
      issuer: data.config.issuer,
      cert: data.config.cert,
      audienceRestriction: data.config.audienceRestriction,
      identifierFormat: data.config.identifierFormat,
    }
  } catch (error) {
    console.error("[v0] Error in getSSOConfig:", error)
    return null
  }
}
