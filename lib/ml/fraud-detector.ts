import { generateObject } from "ai"
import { z } from "zod"
import type { SupabaseClient } from "@supabase/supabase-js"

// Advanced Fraud Detection and Anomaly Detection System
export class FraudDetector {
  constructor(
    private supabase: SupabaseClient,
    private userId: string,
  ) {}

  async analyzeTransaction(transaction: {
    id: string
    description: string
    amount: number
    merchant?: string
    location?: string
    timestamp: string
    card_last4?: string
  }) {
    console.log("[v0] Fraud Detector: Analyzing transaction", transaction.id)

    // Get user's normal behavior patterns
    const userProfile = await this.getUserBehaviorProfile()
    const recentTransactions = await this.getRecentTransactions()

    const prompt = `You are an advanced fraud detection AI analyzing a transaction for anomalies.

Transaction Under Review:
${JSON.stringify(transaction, null, 2)}

User's Normal Behavior Profile:
${JSON.stringify(userProfile, null, 2)}

Recent Transactions (Last 30 days):
${JSON.stringify(recentTransactions.slice(0, 20), null, 2)}

Analyze this transaction for:
1. Amount anomalies (unusually high/low)
2. Location anomalies (unusual location for this user)
3. Merchant anomalies (first-time merchant or unusual category)
4. Timing anomalies (unusual time of day/day of week)
5. Velocity anomalies (too many transactions in short time)
6. Pattern breaks (doesn't match user's typical behavior)

Return a detailed fraud risk assessment.`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        risk_score: z.number().min(0).max(100),
        risk_level: z.enum(["low", "medium", "high", "critical"]),
        anomalies_detected: z.array(
          z.object({
            type: z.string(),
            description: z.string(),
            severity: z.enum(["low", "medium", "high"]),
          }),
        ),
        recommendation: z.enum(["approve", "review", "block", "verify"]),
        reasoning: z.string(),
        confidence: z.number().min(0).max(100),
        similar_fraud_patterns: z.array(z.string()),
      }),
      prompt,
    })

    // Store fraud analysis
    await this.supabase.from("fraud_analyses").insert({
      user_id: this.userId,
      transaction_id: transaction.id,
      risk_score: object.risk_score,
      risk_level: object.risk_level,
      anomalies_detected: object.anomalies_detected,
      recommendation: object.recommendation,
      reasoning: object.reasoning,
      confidence: object.confidence,
    })

    // If high risk, trigger alert
    if (object.risk_level === "high" || object.risk_level === "critical") {
      await this.triggerFraudAlert(transaction, object)
    }

    console.log("[v0] Fraud Detector: Risk level", object.risk_level, `(${object.risk_score}/100)`)

    return object
  }

  private async getUserBehaviorProfile() {
    const { data } = await this.supabase.from("user_behavior_profiles").select("*").eq("user_id", this.userId).single()

    return (
      data || {
        avg_transaction_amount: 0,
        typical_merchants: [],
        typical_locations: [],
        typical_times: [],
        spending_patterns: {},
      }
    )
  }

  private async getRecentTransactions() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data } = await this.supabase
      .from("transactions")
      .select("*")
      .eq("user_id", this.userId)
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false })

    return data || []
  }

  private async triggerFraudAlert(transaction: any, analysis: any) {
    console.log("[v0] Fraud Detector: Triggering fraud alert")

    await this.supabase.from("fraud_alerts").insert({
      user_id: this.userId,
      transaction_id: transaction.id,
      alert_type: "potential_fraud",
      risk_level: analysis.risk_level,
      message: `Suspicious transaction detected: ${transaction.description} for $${transaction.amount}`,
      details: analysis,
      status: "pending",
    })

    // In production, send notifications via email/SMS/push
  }
}

export class EnhancedFraudDetector extends FraudDetector {
  // Vendor fraud detection methods
  async detectDuplicateVendorPayments(vendorId: string, timeWindow = 24) {
    console.log("[v0] Enhanced Fraud Detector: Checking duplicate vendor payments")

    const windowStart = new Date(Date.now() - timeWindow * 60 * 60 * 1000).toISOString()

    const { data: payments } = await this.supabase
      .from("payments")
      .select("*")
      .eq("vendor_id", vendorId)
      .gte("created_at", windowStart)
      .order("created_at", { ascending: false })

    if (!payments || payments.length < 2) return { detected: false, duplicates: [] }

    // Group by similar amounts (within 1% tolerance)
    const duplicates: any[] = []
    for (let i = 0; i < payments.length; i++) {
      for (let j = i + 1; j < payments.length; j++) {
        const amountDiff = Math.abs(payments[i].amount - payments[j].amount)
        const tolerance = payments[i].amount * 0.01

        if (amountDiff <= tolerance) {
          duplicates.push({
            payment1: payments[i],
            payment2: payments[j],
            similarity: 100 - (amountDiff / payments[i].amount) * 100,
            riskScore: 95,
          })
        }
      }
    }

    return { detected: duplicates.length > 0, duplicates }
  }

  async detectFakeVendors() {
    console.log("[v0] Enhanced Fraud Detector: Scanning for fake vendors")

    const { data: vendors } = await this.supabase
      .from("vendors")
      .select("*, payments(*)")
      .order("created_at", { ascending: false })
      .limit(100)

    const suspicious: any[] = []

    vendors?.forEach((vendor) => {
      let riskScore = 0
      const reasons: string[] = []

      // New vendor with immediate large payment
      const firstPayment = vendor.payments?.[0]
      if (firstPayment) {
        const vendorAge = Date.now() - new Date(vendor.created_at).getTime()
        const paymentAge = Date.now() - new Date(firstPayment.created_at).getTime()

        if (vendorAge < 7 * 24 * 60 * 60 * 1000 && firstPayment.amount > 10000) {
          riskScore += 30
          reasons.push("Large payment to newly created vendor")
        }
      }

      // Incomplete vendor information
      if (!vendor.address || !vendor.phone || !vendor.tax_id) {
        riskScore += 20
        reasons.push("Incomplete vendor profile")
      }

      // Single large payment with no follow-up
      if (vendor.payments?.length === 1 && vendor.payments[0].amount > 5000) {
        riskScore += 25
        reasons.push("Single large transaction only")
      }

      if (riskScore >= 50) {
        suspicious.push({ vendor, riskScore, reasons })
      }
    })

    return suspicious
  }

  // Payroll fraud detection methods
  async detectGhostEmployees() {
    console.log("[v0] Enhanced Fraud Detector: Detecting ghost employees")

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: employees } = await this.supabase
      .from("employees")
      .select("*, payroll_records(*), timesheets(*)")
      .eq("status", "active")

    const ghostEmployees: any[] = []

    employees?.forEach((employee) => {
      const recentPayroll = employee.payroll_records?.filter(
        (p: any) => new Date(p.pay_date).toISOString() >= thirtyDaysAgo,
      )
      const recentTimesheets = employee.timesheets?.filter((t: any) => new Date(t.date).toISOString() >= thirtyDaysAgo)

      // Received pay but no timesheet entries
      if (recentPayroll && recentPayroll.length > 0 && (!recentTimesheets || recentTimesheets.length === 0)) {
        ghostEmployees.push({
          employee,
          riskScore: 88,
          reason: "Receiving payroll without timesheet activity",
          recentPayments: recentPayroll.reduce((sum: number, p: any) => sum + p.net_pay, 0),
        })
      }
    })

    return ghostEmployees
  }

  async detectTimeTheft() {
    console.log("[v0] Enhanced Fraud Detector: Analyzing time theft patterns")

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: timesheets } = await this.supabase
      .from("timesheets")
      .select("*, employee:employees(*)")
      .gte("date", sevenDaysAgo)
      .order("clock_in", { ascending: true })

    const suspiciousPatterns: any[] = []

    // Group by clock-in time (within 1 minute)
    const timeGroups: Record<string, any[]> = {}

    timesheets?.forEach((entry) => {
      const clockInKey = entry.clock_in.substring(0, 16) // YYYY-MM-DD HH:MM
      if (!timeGroups[clockInKey]) timeGroups[clockInKey] = []
      timeGroups[clockInKey].push(entry)
    })

    // Flag groups with 3+ employees clocking in simultaneously
    Object.entries(timeGroups).forEach(([time, entries]) => {
      if (entries.length >= 3) {
        suspiciousPatterns.push({
          timestamp: time,
          employeeCount: entries.length,
          employees: entries.map((e) => e.employee),
          riskScore: 84,
          reason: "Multiple employees clocking in/out simultaneously",
        })
      }
    })

    return suspiciousPatterns
  }

  async detectPayrollAnomalies(employeeId: string) {
    console.log("[v0] Enhanced Fraud Detector: Checking payroll anomalies")

    const { data: payrollHistory } = await this.supabase
      .from("payroll_records")
      .select("*")
      .eq("employee_id", employeeId)
      .order("pay_date", { ascending: false })
      .limit(12)

    if (!payrollHistory || payrollHistory.length < 3) return { detected: false }

    const anomalies: any[] = []

    // Calculate average and detect outliers
    const amounts = payrollHistory.map((p) => p.gross_pay)
    const avg = amounts.reduce((sum, a) => sum + a, 0) / amounts.length
    const stdDev = Math.sqrt(amounts.reduce((sum, a) => sum + Math.pow(a - avg, 2), 0) / amounts.length)

    payrollHistory.forEach((record) => {
      const deviation = Math.abs(record.gross_pay - avg)
      if (deviation > stdDev * 2) {
        anomalies.push({
          record,
          deviation,
          riskScore: 75,
          reason: `Gross pay ${record.gross_pay > avg ? "increase" : "decrease"} of ${((deviation / avg) * 100).toFixed(1)}%`,
        })
      }
    })

    return { detected: anomalies.length > 0, anomalies }
  }
}
