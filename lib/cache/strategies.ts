import { CacheManager } from "./redis-client"

/**
 * Cache strategy for user data
 * TTL: 5 minutes
 */
export async function cacheUserData<T>(userId: string, fetchData: () => Promise<T>): Promise<T> {
  const key = `user:${userId}`
  return CacheManager.getOrSet(key, fetchData, {
    ttl: 300, // 5 minutes
    tags: ["user", userId],
  })
}

/**
 * Cache strategy for organization data
 * TTL: 10 minutes
 */
export async function cacheOrganizationData<T>(orgId: string, fetchData: () => Promise<T>): Promise<T> {
  const key = `org:${orgId}`
  return CacheManager.getOrSet(key, fetchData, {
    ttl: 600, // 10 minutes
    tags: ["organization", orgId],
  })
}

/**
 * Cache strategy for dashboard data
 * TTL: 2 minutes (frequently updated)
 */
export async function cacheDashboardData<T>(userId: string, type: string, fetchData: () => Promise<T>): Promise<T> {
  const key = `dashboard:${userId}:${type}`
  return CacheManager.getOrSet(key, fetchData, {
    ttl: 120, // 2 minutes
    tags: ["dashboard", userId],
  })
}

/**
 * Cache strategy for reports
 * TTL: 1 hour (less frequently updated)
 */
export async function cacheReportData<T>(reportId: string, fetchData: () => Promise<T>): Promise<T> {
  const key = `report:${reportId}`
  return CacheManager.getOrSet(key, fetchData, {
    ttl: 3600, // 1 hour
    tags: ["report", reportId],
  })
}

/**
 * Cache strategy for analytics
 * TTL: 15 minutes
 */
export async function cacheAnalyticsData<T>(
  organizationId: string,
  period: string,
  fetchData: () => Promise<T>,
): Promise<T> {
  const key = `analytics:${organizationId}:${period}`
  return CacheManager.getOrSet(key, fetchData, {
    ttl: 900, // 15 minutes
    tags: ["analytics", organizationId],
  })
}

/**
 * Invalidate user-related caches
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  await CacheManager.invalidateTag(userId)
  await CacheManager.invalidateTag("user")
}

/**
 * Invalidate organization-related caches
 */
export async function invalidateOrganizationCache(orgId: string): Promise<void> {
  await CacheManager.invalidateTag(orgId)
  await CacheManager.invalidateTag("organization")
}
