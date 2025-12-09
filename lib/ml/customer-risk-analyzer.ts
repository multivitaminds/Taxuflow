export class CustomerRiskAnalyzer {
  async analyzeCustomerRisk(customer: any) {
    const creditScore = this.calculateCreditScore(customer)
    const defaultProbability = this.predictDefaultProbability(customer)
    const collectionPriority = this.determineCollectionPriority(customer, creditScore, defaultProbability)

    return {
      creditScore,
      defaultProbability,
      collectionPriority,
      outstandingBalance: customer.outstanding_balance || 0,
      avgDaysLate: this.calculateAvgDaysLate(customer),
      paymentHistory: this.analyzePaymentHistory(customer),
      riskFactors: this.identifyRiskFactors(customer),
    }
  }

  private calculateCreditScore(customer: any): number {
    let score = 100

    // Payment history (40% weight)
    const outstandingBalance = customer.outstanding_balance || 0
    const totalRevenue = customer.total_revenue || 1
    const balanceRatio = outstandingBalance / totalRevenue

    if (balanceRatio > 0.5) score -= 30
    else if (balanceRatio > 0.3) score -= 20
    else if (balanceRatio > 0.1) score -= 10

    // Invoice count and age (30% weight)
    const invoiceCount = customer.invoice_count || 0
    if (invoiceCount === 0) score -= 20
    else if (invoiceCount < 3) score -= 10

    // Customer tenure (20% weight)
    const accountAge = this.getAccountAgeDays(customer.created_at)
    if (accountAge < 30) score -= 15
    else if (accountAge < 90) score -= 10
    else if (accountAge < 180) score -= 5

    // Recent activity (10% weight)
    if (!customer.email) score -= 5
    if (!customer.phone) score -= 5

    return Math.max(0, Math.min(100, score))
  }

  private predictDefaultProbability(customer: any): number {
    const outstandingBalance = customer.outstanding_balance || 0
    const totalRevenue = customer.total_revenue || 1
    const balanceRatio = outstandingBalance / totalRevenue

    let probability = 5 // Base 5% default risk

    if (balanceRatio > 0.8) probability += 60
    else if (balanceRatio > 0.6) probability += 40
    else if (balanceRatio > 0.4) probability += 25
    else if (balanceRatio > 0.2) probability += 10

    const invoiceCount = customer.invoice_count || 0
    if (invoiceCount === 0) probability += 20
    else if (invoiceCount < 3) probability += 10

    return Math.min(95, probability)
  }

  private determineCollectionPriority(customer: any, creditScore: number, defaultProbability: number): number {
    const outstandingBalance = customer.outstanding_balance || 0

    if (outstandingBalance === 0) return 1

    let priority = 5

    // High default risk increases priority
    if (defaultProbability > 70) priority += 4
    else if (defaultProbability > 50) priority += 3
    else if (defaultProbability > 30) priority += 2

    // Low credit score increases priority
    if (creditScore < 40) priority += 2
    else if (creditScore < 60) priority += 1

    // High outstanding balance increases priority
    if (outstandingBalance > 50000) priority += 2
    else if (outstandingBalance > 20000) priority += 1

    return Math.min(10, priority)
  }

  private calculateAvgDaysLate(customer: any): number {
    // Mock calculation - would query actual invoice data
    const outstandingBalance = customer.outstanding_balance || 0
    if (outstandingBalance === 0) return 0

    // Estimate based on balance ratio
    const totalRevenue = customer.total_revenue || 1
    const balanceRatio = outstandingBalance / totalRevenue

    if (balanceRatio > 0.5) return 45
    if (balanceRatio > 0.3) return 30
    if (balanceRatio > 0.1) return 15
    return 5
  }

  private analyzePaymentHistory(customer: any) {
    // Mock payment history analysis
    return {
      onTimePayments: 0,
      latePayments: 0,
      totalPayments: 0,
      onTimeRate: 0,
    }
  }

  private identifyRiskFactors(customer: any): string[] {
    const factors: string[] = []

    if ((customer.outstanding_balance || 0) > 10000) {
      factors.push("High outstanding balance")
    }

    if (!(customer.invoice_count || 0)) {
      factors.push("No invoice history")
    }

    if (!customer.email) {
      factors.push("Missing contact information")
    }

    return factors
  }

  private getAccountAgeDays(createdAt: string): number {
    if (!createdAt) return 0
    const created = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
  }
}
