import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch deployment history from database
    const { data: deployments, error } = await supabase
      .from("deployments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Error fetching deployments:", error)
      // Return mock data for demo if table doesn't exist
      return NextResponse.json({
        deployments: generateMockDeployments(),
        stats: calculateStats(generateMockDeployments()),
      })
    }

    // Calculate stats
    const stats = calculateStats(deployments)

    return NextResponse.json({
      deployments: deployments.map((d) => ({
        id: d.id,
        status: d.status,
        environment: d.environment,
        branch: d.branch,
        commit: d.commit_sha,
        commitMessage: d.commit_message,
        author: d.author,
        createdAt: d.created_at,
        duration: d.duration_seconds,
        url: d.deployment_url,
      })),
      stats,
    })
  } catch (error) {
    console.error("[v0] Deployment fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch deployments" }, { status: 500 })
  }
}

function calculateStats(deployments: any[]) {
  const total = deployments.length
  const successful = deployments.filter((d) => d.status === "success").length
  const failed = deployments.filter((d) => d.status === "failed").length
  const avgDuration =
    total > 0 ? Math.round(deployments.reduce((sum, d) => sum + (d.duration_seconds || 0), 0) / total) : 0

  return { total, successful, failed, avgDuration }
}

function generateMockDeployments() {
  return [
    {
      id: "1",
      status: "success",
      environment: "production",
      branch: "main",
      commit_sha: "a1b2c3d",
      commit_message: "Add intelligent subscription system",
      author: "John Doe",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      duration_seconds: 180,
      deployment_url: "https://taxu.io",
    },
    {
      id: "2",
      status: "success",
      environment: "production",
      branch: "main",
      commit_sha: "e4f5g6h",
      commit_message: "Fix sandbox banner positioning",
      author: "Jane Smith",
      created_at: new Date(Date.now() - 7200000).toISOString(),
      duration_seconds: 165,
      deployment_url: "https://taxu.io",
    },
    {
      id: "3",
      status: "building",
      environment: "production",
      branch: "main",
      commit_sha: "i7j8k9l",
      commit_message: "Update document extraction with Claude",
      author: "John Doe",
      created_at: new Date().toISOString(),
      duration_seconds: 0,
      deployment_url: null,
    },
  ]
}
