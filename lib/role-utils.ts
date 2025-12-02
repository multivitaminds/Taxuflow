export type UserType = "regular" | "business" | "developer"
export type SubscriptionTier = "free" | "pro-monthly" | "pro-yearly" | "business-monthly" | "business-yearly"

export interface FeatureAccess {
  banking: boolean
  wallet: boolean
  accounting: boolean
  tax_filing: boolean
  api_access: boolean
  developer_portal: boolean
  employee_management: boolean
}

export function getFeaturesByUserType(userType: UserType, subscriptionTier: SubscriptionTier = "free"): FeatureAccess {
  const baseFeatures: FeatureAccess = {
    banking: false,
    wallet: false,
    accounting: false,
    tax_filing: true, // Available to all users
    api_access: false,
    developer_portal: false,
    employee_management: false,
  }

  // Regular users
  if (userType === "regular") {
    if (subscriptionTier === "pro-monthly" || subscriptionTier === "pro-yearly") {
      return {
        ...baseFeatures,
        banking: true,
        wallet: true,
      }
    }
    return baseFeatures
  }

  // Business users
  if (userType === "business") {
    return {
      ...baseFeatures,
      banking: true,
      wallet: true,
      accounting: true,
      employee_management: subscriptionTier.includes("business"),
    }
  }

  // Developer users
  if (userType === "developer") {
    return {
      ...baseFeatures,
      banking: subscriptionTier !== "free",
      wallet: subscriptionTier !== "free",
      accounting: subscriptionTier.includes("business"),
      api_access: true,
      developer_portal: true,
    }
  }

  return baseFeatures
}

export function getUpgradeMessage(feature: keyof FeatureAccess, userType: UserType): string {
  const messages: Record<keyof FeatureAccess, string> = {
    banking: "Upgrade to Pro to access banking features",
    wallet: "Upgrade to Pro to access wallet features",
    accounting: "Switch to Business account to access accounting features",
    tax_filing: "Tax filing is available on all plans",
    api_access: "Switch to Developer account to access the API",
    developer_portal: "Switch to Developer account to access the portal",
    employee_management: "Upgrade to Business plan to manage employees",
  }

  return messages[feature] || "Upgrade your account to access this feature"
}
