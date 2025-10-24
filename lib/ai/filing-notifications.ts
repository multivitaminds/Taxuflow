import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function sendProactiveFilingUpdate(userId: string, filingId: string) {
  const supabase = await createClient()

  // Get filing status
  const { data: filing } = await supabase.from("tax_filings").select("*").eq("id", filingId).single()

  if (!filing) return

  // Generate personalized AI message based on status
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `Generate a friendly, concise notification message for a user whose tax return status just changed to: ${filing.status}. 
    
    Additional context:
    - Provider status: ${filing.provider_status || "N/A"}
    - Refund amount: $${filing.refund_amount || 0}
    - Submitted: ${filing.submitted_at}
    
    Keep it under 100 words, encouraging, and actionable. Include next steps if relevant.`,
  })

  // Store notification in database
  await supabase.from("notifications").insert({
    user_id: userId,
    type: "filing_status_update",
    title: `Filing Status Update: ${filing.status}`,
    message: text,
    data: { filing_id: filingId, status: filing.status },
    read: false,
  })

  return text
}

export async function checkFilingStatusAndNotify(filingId: string) {
  const supabase = await createClient()

  // Get current filing
  const { data: filing } = await supabase.from("tax_filings").select("*").eq("id", filingId).single()

  if (!filing) return

  // Check if status changed in last 5 minutes
  const lastChecked = new Date(filing.updated_at)
  const now = new Date()
  const diffMinutes = (now.getTime() - lastChecked.getTime()) / 1000 / 60

  if (diffMinutes < 5) {
    // Status recently changed, send proactive notification
    await sendProactiveFilingUpdate(filing.user_id, filingId)
  }
}
