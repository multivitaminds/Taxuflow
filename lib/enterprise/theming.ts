import { createServerClient } from "@/lib/supabase/server"

export interface BrandTheme {
  organizationId: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoUrl: string
  faviconUrl: string
  fontFamily: string
  customCSS?: string
  whiteLabel: boolean
}

/**
 * Get organization branding theme
 */
export async function getOrganizationTheme(organizationId: string): Promise<BrandTheme | null> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("organization_themes")
      .select("*")
      .eq("organization_id", organizationId)
      .single()

    if (error || !data) {
      return null
    }

    return {
      organizationId: data.organization_id,
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      accentColor: data.accent_color,
      logoUrl: data.logo_url,
      faviconUrl: data.favicon_url,
      fontFamily: data.font_family,
      customCSS: data.custom_css,
      whiteLabel: data.white_label,
    }
  } catch (error) {
    console.error("[v0] Error fetching organization theme:", error)
    return null
  }
}

/**
 * Update organization branding
 */
export async function updateOrganizationTheme(theme: BrandTheme): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase.from("organization_themes").upsert({
      organization_id: theme.organizationId,
      primary_color: theme.primaryColor,
      secondary_color: theme.secondaryColor,
      accent_color: theme.accentColor,
      logo_url: theme.logoUrl,
      favicon_url: theme.faviconUrl,
      font_family: theme.fontFamily,
      custom_css: theme.customCSS,
      white_label: theme.whiteLabel,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Error updating organization theme:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in updateOrganizationTheme:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Generate CSS variables from theme
 */
export function generateThemeCSS(theme: BrandTheme): string {
  return `
    :root {
      --brand-primary: ${theme.primaryColor};
      --brand-secondary: ${theme.secondaryColor};
      --brand-accent: ${theme.accentColor};
      --brand-font: ${theme.fontFamily};
    }
    
    ${theme.customCSS || ""}
  `
}
