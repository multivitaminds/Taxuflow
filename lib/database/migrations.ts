import { createAdminClient } from "@/lib/supabase/admin"

export interface Migration {
  version: string
  name: string
  sql: string
}

export class MigrationRunner {
  private supabase = createAdminClient()

  async runMigrations(migrations: Migration[]) {
    console.log(`[v0] Running ${migrations.length} migrations...`)

    for (const migration of migrations) {
      try {
        console.log(`[v0] Running migration: ${migration.version} - ${migration.name}`)

        // Execute SQL
        const { error } = await this.supabase.rpc("exec_sql", {
          sql: migration.sql,
        })

        if (error) {
          console.error(`[v0] Migration ${migration.version} failed:`, error)
          throw error
        }

        // Record migration
        await this.supabase.from("supabase_migrations.schema_migrations").insert({
          version: migration.version,
          name: migration.name,
          statements: [migration.sql],
        })

        console.log(`[v0] Migration ${migration.version} completed successfully`)
      } catch (error) {
        console.error(`[v0] Failed to run migration ${migration.version}:`, error)
        throw error
      }
    }

    console.log("[v0] All migrations completed successfully")
  }

  async getAppliedMigrations(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("supabase_migrations.schema_migrations")
      .select("version")
      .order("version", { ascending: true })

    if (error) {
      console.error("[v0] Failed to fetch applied migrations:", error)
      return []
    }

    return data.map((m) => m.version)
  }

  async getPendingMigrations(allMigrations: Migration[]): Promise<Migration[]> {
    const applied = await this.getAppliedMigrations()
    return allMigrations.filter((m) => !applied.includes(m.version))
  }
}
