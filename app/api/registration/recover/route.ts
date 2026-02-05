import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// This API route recovers registration state server-side
// It can work even when the client-side session is lost by using the registration_id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const registrationId = searchParams.get("id")
  
  try {
    const supabase = await createClient()
    
    // First try to get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // User is authenticated - get their latest registration
      const { data: registration, error } = await supabase
        .from("go_live_applications")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "draft")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (error) {
        console.error("[v0] Registration recovery error:", error)
        return NextResponse.json({ error: "Failed to load registration" }, { status: 500 })
      }
      
      if (registration) {
        return NextResponse.json({
          success: true,
          registration: {
            id: registration.id,
            currentStep: registration.current_step || 1,
            formData: registration.form_data || {},
            completedSteps: registration.completed_steps || [],
            status: registration.status,
          },
          user: {
            id: user.id,
            email: user.email,
          }
        })
      }
      
      // No registration found - return fresh state
      return NextResponse.json({
        success: true,
        registration: null,
        user: {
          id: user.id,
          email: user.email,
        }
      })
    }
    
    // User not authenticated - try to recover by registration ID
    if (registrationId) {
      // Use service role to read registration without auth
      const { data: registration, error } = await supabase
        .from("go_live_applications")
        .select("id, current_step, status, user_id")
        .eq("id", registrationId)
        .eq("status", "draft")
        .maybeSingle()
      
      if (registration) {
        // Registration exists but user needs to re-authenticate
        return NextResponse.json({
          success: false,
          needsAuth: true,
          registrationExists: true,
          currentStep: registration.current_step || 1,
        })
      }
    }
    
    // No session and no valid registration ID
    return NextResponse.json({
      success: false,
      needsAuth: true,
      registrationExists: false,
    })
    
  } catch (error) {
    console.error("[v0] Registration recovery error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Save registration progress server-side
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    
    const body = await request.json()
    const { formData, currentStep, applicationId } = body
    
    if (applicationId) {
      // Update existing registration
      const { data, error } = await supabase
        .from("go_live_applications")
        .update({
          form_data: formData,
          current_step: currentStep,
          completed_steps: body.completedSteps || [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId)
        .eq("user_id", user.id)
        .select()
        .single()
      
      if (error) {
        console.error("[v0] Registration save error:", error)
        return NextResponse.json({ error: "Failed to save registration" }, { status: 500 })
      }
      
      return NextResponse.json({
        success: true,
        registration: {
          id: data.id,
          currentStep: data.current_step,
        }
      })
    } else {
      // Create new registration
      const { data, error } = await supabase
        .from("go_live_applications")
        .insert({
          user_id: user.id,
          status: "draft",
          form_data: formData,
          current_step: currentStep,
          completed_steps: body.completedSteps || [],
        })
        .select()
        .single()
      
      if (error) {
        console.error("[v0] Registration create error:", error)
        return NextResponse.json({ error: "Failed to create registration" }, { status: 500 })
      }
      
      return NextResponse.json({
        success: true,
        registration: {
          id: data.id,
          currentStep: data.current_step,
        }
      })
    }
    
  } catch (error) {
    console.error("[v0] Registration save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
