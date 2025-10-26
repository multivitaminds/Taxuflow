import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { decrypt } from "@/lib/crypto"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    const supabase = await createClient()

    // Get QuickBooks connection
    const { data: connection, error: connError } = await supabase
      .from("qbo_connections")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (connError || !connection) {
      return NextResponse.json({ error: "QuickBooks not connected" }, { status: 400 })
    }

    console.log("[v0] Starting QuickBooks sync for realm:", connection.realm_id)

    const accessToken = decrypt(connection.access_token)

    const expensesResponse = await fetch(
      `https://quickbooks.api.intuit.com/v3/company/${connection.realm_id}/query?query=SELECT * FROM Purchase WHERE TxnDate >= '2024-01-01'`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    )

    const expensesData = await expensesResponse.json()
    const expenses = expensesData.QueryResponse?.Purchase || []

    const invoicesResponse = await fetch(
      `https://quickbooks.api.intuit.com/v3/company/${connection.realm_id}/query?query=SELECT * FROM Invoice WHERE TxnDate >= '2024-01-01'`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    )

    const invoicesData = await invoicesResponse.json()
    const invoices = invoicesData.QueryResponse?.Invoice || []

    const transactionsToStore = []

    for (const expense of expenses) {
      const { text: category } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `Categorize this business expense for tax purposes. Return only one of: business_expense, contractor_payment, office_supplies, travel, meals, utilities, rent, other.
        
Expense: ${expense.PaymentType} - ${expense.TotalAmt} - ${expense.PrivateNote || "No description"}`,
      })

      transactionsToStore.push({
        user_id: userId,
        qbo_id: expense.Id,
        transaction_type: "expense",
        amount: -Math.abs(expense.TotalAmt),
        description: expense.PrivateNote || expense.PaymentType,
        transaction_date: expense.TxnDate,
        tax_category: category.trim(),
      })
    }

    for (const invoice of invoices) {
      transactionsToStore.push({
        user_id: userId,
        qbo_id: invoice.Id,
        transaction_type: "income",
        amount: invoice.TotalAmt,
        description: `Invoice ${invoice.DocNumber}`,
        transaction_date: invoice.TxnDate,
        tax_category: "business_income",
      })
    }

    if (transactionsToStore.length > 0) {
      await supabase.from("qbo_transactions").upsert(transactionsToStore, {
        onConflict: "qbo_id",
      })
    }

    // Update last sync time
    await supabase.from("qbo_connections").update({ last_sync_at: new Date().toISOString() }).eq("user_id", userId)

    console.log("[v0] QuickBooks sync complete:", transactionsToStore.length, "transactions")

    return NextResponse.json({
      success: true,
      transactionCount: transactionsToStore.length,
      expenses: expenses.length,
      invoices: invoices.length,
    })
  } catch (error) {
    console.error("[v0] QuickBooks sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
