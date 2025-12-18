import { createServerClient } from "@/lib/supabase/server"
import type { OrganizationContext } from "./context"

/**
 * Fetch data from the books schema with organization context
 * Automatically filters by organization membership
 */
export async function fetchBooksData<T>(
  table: string,
  orgContext: OrganizationContext,
  query?: {
    select?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
  }
): Promise<{ data: T[] | null; error: any }> {
  try {
    const supabase = await createServerClient()

    let queryBuilder = supabase
      .from(table)
      .select(query?.select || "*")
      .in("org_id", orgContext.organizationIds)

    // Apply additional filters
    if (query?.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value)
      })
    }

    // Apply ordering
    if (query?.orderBy) {
      queryBuilder = queryBuilder.order(query.orderBy.column, {
        ascending: query.orderBy.ascending ?? true,
      })
    }

    // Apply limit
    if (query?.limit) {
      queryBuilder = queryBuilder.limit(query.limit)
    }

    const { data, error } = await queryBuilder

    return { data: data as T[] | null, error }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Fetch aggregated data from both public and books schemas
 * Combines personal data (public schema) with organization data (books schema)
 */
export async function fetchCombinedData<T>(params: {
  publicTable: string
  booksTable: string
  orgContext: OrganizationContext
  select?: string
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
}): Promise<{
  personalData: T[] | null
  orgData: T[] | null
  combined: T[]
  error: any
}> {
  const supabase = await createServerClient()

  // Fetch personal data from public schema
  let publicQuery = supabase
    .from(params.publicTable)
    .select(params.select || "*")
    .eq("user_id", params.orgContext.userId)

  if (params.orderBy) {
    publicQuery = publicQuery.order(params.orderBy.column, {
      ascending: params.orderBy.ascending ?? true,
    })
  }

  if (params.limit) {
    publicQuery = publicQuery.limit(params.limit)
  }

  const { data: personalData, error: personalError } = await publicQuery

  // Fetch organization data from books schema if user has org access
  let orgData: T[] | null = null
  let orgError = null

  if (params.orgContext.hasOrganizationAccess) {
    const { data, error } = await fetchBooksData<T>(params.booksTable, params.orgContext, {
      select: params.select,
      orderBy: params.orderBy,
      limit: params.limit,
    })
    orgData = data
    orgError = error
  }

  // Combine both datasets
  const combined: T[] = [...(personalData || []), ...(orgData || [])]

  // Sort combined data if orderBy is specified
  if (params.orderBy) {
    combined.sort((a: any, b: any) => {
      const aVal = a[params.orderBy!.column]
      const bVal = b[params.orderBy!.column]
      return (params.orderBy!.ascending ?? true) ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1
    })
  }

  return {
    personalData: personalData as T[] | null,
    orgData: orgData as T[] | null,
    combined,
    error: personalError || orgError,
  }
}
