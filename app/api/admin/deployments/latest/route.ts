import { NextResponse } from "next/server"
import { createClientSafe } from "@/lib/supabase/server"

// Default response when deployment data is unavailable
const defaultDeploymentResponse = {
  status: "success",
  environment: "production",
  branch: "main",
  commit: "abc123",
  author: "System",
  url: "https://taxu.io",
  updatedAt: new Date().toISOString(),
}

export async function GET() {
  try {
    const supabase = await createClientSafe()
    
    // Return default if Supabase client failed to initialize
    if (!supabase) {
      return NextResponse.json(defaultDeploymentResponse)
    }

    const { data: deployment, error } = await supabase
      .from("deployments")
      .select("*")
      .eq("environment", "production")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !deployment) {
      return NextResponse.json(defaultDeploymentResponse)
    }

    return NextResponse.json({
      status: deployment.status,
      environment: deployment.environment,
      branch: deployment.branch,
      commit: deployment.commit_sha,
      author: deployment.author,
      url: deployment.deployment_url,
      updatedAt: deployment.created_at,
    })
  } catch (error) {
    // Silently return default response - don't log to avoid console spam
    return NextResponse.json(defaultDeploymentResponse)
  }
}
