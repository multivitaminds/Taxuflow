import { Redis } from "@upstash/redis"

// Create Redis client instance
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[] // Cache tags for invalidation
}

export class CacheManager {
  /**
   * Get cached data by key
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data as T | null
    } catch (error) {
      console.error("[v0] Cache get error:", error)
      return null
    }
  }

  /**
   * Set cached data with optional TTL
   */
  static async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      if (options?.ttl) {
        await redis.setex(key, options.ttl, JSON.stringify(value))
      } else {
        await redis.set(key, JSON.stringify(value))
      }

      // Store tags for invalidation
      if (options?.tags && options.tags.length > 0) {
        for (const tag of options.tags) {
          await redis.sadd(`tag:${tag}`, key)
        }
      }
    } catch (error) {
      console.error("[v0] Cache set error:", error)
    }
  }

  /**
   * Delete cached data by key
   */
  static async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error("[v0] Cache delete error:", error)
    }
  }

  /**
   * Invalidate all keys with a specific tag
   */
  static async invalidateTag(tag: string): Promise<void> {
    try {
      const keys = await redis.smembers(`tag:${tag}`)
      if (keys && keys.length > 0) {
        await redis.del(...keys)
        await redis.del(`tag:${tag}`)
      }
    } catch (error) {
      console.error("[v0] Cache invalidate tag error:", error)
    }
  }

  /**
   * Get or set cached data with a fallback function
   */
  static async getOrSet<T>(key: string, fallback: () => Promise<T>, options?: CacheOptions): Promise<T> {
    const cached = await this.get<T>(key)

    if (cached !== null) {
      return cached
    }

    const data = await fallback()
    await this.set(key, data, options)
    return data
  }

  /**
   * Increment a counter
   */
  static async increment(key: string, amount = 1): Promise<number> {
    try {
      return await redis.incrby(key, amount)
    } catch (error) {
      console.error("[v0] Cache increment error:", error)
      return 0
    }
  }

  /**
   * Set cache with expiry time
   */
  static async setWithExpiry(key: string, value: any, seconds: number): Promise<void> {
    try {
      await redis.setex(key, seconds, JSON.stringify(value))
    } catch (error) {
      console.error("[v0] Cache setex error:", error)
    }
  }
}
