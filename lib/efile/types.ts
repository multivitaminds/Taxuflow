// E-file provider types and interfaces

export type FilingStatus = "pending" | "submitted" | "accepted" | "rejected" | "processing"

export interface TaxReturn {
  taxYear: number
  filingStatus: "single" | "married_joint" | "married_separate" | "head_of_household"
  taxpayer: {
    firstName: string
    lastName: string
    ssn: string
    dateOfBirth: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    }
    email: string
    phone?: string
  }
  spouse?: {
    firstName: string
    lastName: string
    ssn: string
    dateOfBirth: string
  }
  income: {
    wages: number
    interest?: number
    dividends?: number
    capitalGains?: number
    businessIncome?: number
    otherIncome?: number
  }
  deductions: {
    standardDeduction: number
    itemizedDeductions?: number
    studentLoanInterest?: number
    iraContributions?: number
  }
  credits: {
    childTaxCredit?: number
    earnedIncomeCredit?: number
    educationCredits?: number
  }
  taxLiability: {
    federalTax: number
    stateTax: number
    totalWithholding: number
  }
  refund: {
    federalRefund: number
    stateRefund: number
    directDeposit?: {
      routingNumber: string
      accountNumber: string
      accountType: "checking" | "savings"
    }
  }
}

export interface BusinessTaxReturn {
  taxYear: number
  entityType: "c_corp" | "s_corp" | "partnership" | "llc"
  business: {
    name: string
    ein: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    }
    email: string
    phone?: string
  }
  income: {
    grossReceipts: number
    returns: number
    costOfGoodsSold: number
    otherIncome: number
  }
  deductions: {
    salaries: number
    rent: number
    taxes: number
    interest: number
    depreciation: number
    otherDeductions: number
  }
  taxLiability: {
    totalTax: number
    estimatedPayments: number
  }
  officers?: Array<{
    name: string
    ssn: string
    title: string
    ownership: number
  }>
}

export interface PayrollTaxReturn {
  taxYear: number
  quarter: 1 | 2 | 3 | 4
  formType: "941" | "940" | "w2" | "1099"
  business: {
    name: string
    ein: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    }
  }
  employees?: Array<{
    firstName: string
    lastName: string
    ssn: string
    wages: number
    federalWithholding: number
    socialSecurityWithholding: number
    medicareWithholding: number
  }>
  contractors?: Array<{
    firstName: string
    lastName: string
    ssn: string
    ein?: string
    payments: number
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    }
  }>
  totals: {
    totalWages: number
    totalFederalWithholding: number
    totalSocialSecurity: number
    totalMedicare: number
  }
}

export interface FilingResult {
  success: boolean
  submissionId: string
  status: FilingStatus
  message: string
  errors?: string[]
  estimatedProcessingTime?: string
}

export interface FilingStatusResponse {
  submissionId: string
  status: FilingStatus
  irsStatus?: string
  stateStatus?: string
  acceptedAt?: string
  rejectedAt?: string
  rejectionReasons?: string[]
  refundStatus?: {
    federal?: "pending" | "approved" | "sent"
    state?: "pending" | "approved" | "sent"
    estimatedDate?: string
  }
}

export interface EFileProvider {
  name: string
  submitReturn(taxReturn: TaxReturn): Promise<FilingResult>
  getFilingStatus(submissionId: string): Promise<FilingStatusResponse>
  cancelFiling?(submissionId: string): Promise<boolean>
  amendReturn?(submissionId: string, amendments: Partial<TaxReturn>): Promise<FilingResult>
  submitBusinessReturn?(businessReturn: BusinessTaxReturn): Promise<FilingResult>
  submitPayrollReturn?(payrollReturn: PayrollTaxReturn): Promise<FilingResult>
}
