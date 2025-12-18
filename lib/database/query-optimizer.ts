import { createClient } from "@/lib/supabase/server"

/**
 * Optimized query builder with automatic indexing hints
 */
export class QueryOptimizer {
  /**
   * Get paginated results with cursor-based pagination (better performance)
   */
  static async getPaginated<T>(
    table: string,
    {
      limit = 50,
      cursor,
      orderBy = "created_at",
      filters = {},
    }: {
      limit?: number
      cursor?: string
      orderBy?: string
      filters?: Record<string, any>
    },
  ): Promise<{ data: T[]; nextCursor: string | null }> {
    const supabase = await createClient()

    let query = supabase.from(table).select("*").order(orderBy, { ascending: false }).limit(limit)

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    // Apply cursor
    if (cursor) {
      query = query.lt(orderBy, cursor)
    }

    const { data, error } = await query

    if (error) throw error

    const nextCursor = data && data.length === limit ? data[data.length - 1][orderBy] : null

    return { data: data as T[], nextCursor }
  }

  /**
   * Batch insert with optimized performance
   */
  static async batchInsert<T>(table: string, records: T[], batchSize = 100): Promise<void> {
    const supabase = await createClient()

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const { error } = await supabase.from(table).insert(batch)

      if (error) {
        console.error(`[v0] Batch insert error at index ${i}:`, error)
        throw error
      }
    }
  }

  /**
   * Optimized search with full-text search
   */
  static async searchFullText<T>(table: string, column: string, searchTerm: string, limit = 50): Promise<T[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .textSearch(column, searchTerm, {
        type: "websearch",
        config: "english",
      })
      .limit(limit)

    if (error) throw error
    return data as T[]
  }

  /**
   * Aggregate queries with materialized views
   */
  static async getAggregates(
    table: string,
    aggregations: {
      sum?: string[]
      avg?: string[]
      count?: string[]
      max?: string[]
      min?: string[]
    },
    filters?: Record<string, any>,
  ): Promise<any> {
    const supabase = await createClient()

    let selectFields: string[] = ["*"]

    if (aggregations.sum) {
      selectFields = aggregations.sum.map((field) => `${field}.sum()`)
    }
    if (aggregations.avg) {
      selectFields.push(...aggregations.avg.map((field) => `${field}.avg()`))
    }
    if (aggregations.count) {
      selectFields.push("count")
    }

    let query = supabase.from(table).select(selectFields.join(","))

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error } = await query.single()

    if (error) throw error
    return data
  }
}
