// TaxBandits API provider (ready for real integration)

import type { EFileProvider, TaxReturn, FilingResult, FilingStatusResponse } from "../types"

export class TaxBanditsProvider implements EFileProvider {
  name = "TaxBandits"
  private apiKey: string
  private userToken: string
  private apiUrl: string
  private environment: string

  constructor() {
    this.apiKey = process.env.TAXBANDITS_API_KEY || ""
    this.userToken = process.env.TAXBANDITS_USER_TOKEN || ""
    this.environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"
    this.apiUrl =
      this.environment === "production"
        ? "https://api.taxbandits.com/v1.7.3"
        : "https://testsandbox.taxbandits.com/v1.7.3"

    if (!this.apiKey || !this.userToken) {
      console.warn("[v0] TaxBandits credentials not configured. Using mock provider.")
    }
  }

  private async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.apiUrl}/tbsauth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserToken: this.userToken,
        ApiKey: this.apiKey,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to authenticate with TaxBandits")
    }

    const result = await response.json()
    return result.AccessToken
  }

  async submitReturn(taxReturn: TaxReturn): Promise<FilingResult> {
    if (!this.apiKey || !this.userToken) {
      throw new Error("TaxBandits credentials not configured")
    }

    try {
      const accessToken = await this.getAccessToken()

      const taxBanditsPayload = this.transformToTaxBanditsFormat(taxReturn)

      const response = await fetch(`${this.apiUrl}/Form1040/Create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taxBanditsPayload),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] TaxBandits API error:", error)
        throw new Error(error.Errors?.[0]?.Message || "Failed to submit return")
      }

      const result = await response.json()

      if (result.StatusCode === 200 && result.SubmissionId) {
        return {
          success: true,
          submissionId: result.SubmissionId,
          status: "submitted",
          message: "Return submitted successfully to IRS",
          estimatedProcessingTime: "24-48 hours",
        }
      } else {
        return {
          success: false,
          submissionId: result.SubmissionId || "",
          status: "rejected",
          message: result.Errors?.[0]?.Message || "Failed to submit return",
          errors: result.Errors?.map((e: any) => e.Message) || [],
        }
      }
    } catch (error) {
      console.error("[v0] TaxBandits submission error:", error)
      return {
        success: false,
        submissionId: "",
        status: "rejected",
        message: error instanceof Error ? error.message : "Failed to submit return",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      }
    }
  }

  async getFilingStatus(submissionId: string): Promise<FilingStatusResponse> {
    if (!this.apiKey || !this.userToken) {
      throw new Error("TaxBandits credentials not configured")
    }

    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.apiUrl}/Form1040/Status?SubmissionId=${submissionId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get filing status")
      }

      const result = await response.json()

      return {
        submissionId,
        status: this.mapTaxBanditsStatus(result.StatusCode),
        irsStatus: result.IRSStatus,
        stateStatus: result.StateStatus,
        acceptedAt: result.AcceptedDate,
        rejectedAt: result.RejectedDate,
        rejectionReasons: result.Errors?.map((e: any) => e.Message),
        refundStatus: result.RefundStatus
          ? {
              federal: result.RefundStatus.Federal?.toLowerCase(),
              state: result.RefundStatus.State?.toLowerCase(),
              estimatedDate: result.RefundStatus.EstimatedDate,
            }
          : undefined,
      }
    } catch (error) {
      console.error("[v0] TaxBandits status check error:", error)
      throw error
    }
  }

  private transformToTaxBanditsFormat(taxReturn: TaxReturn): any {
    return {
      ReturnHeader: {
        TaxYear: taxReturn.taxYear,
        TaxPayerSSN: taxReturn.taxpayer.ssn,
        TaxPayerName: {
          FirstName: taxReturn.taxpayer.firstName,
          LastName: taxReturn.taxpayer.lastName,
        },
        TaxPayerAddress: {
          Address1: taxReturn.taxpayer.address.street,
          City: taxReturn.taxpayer.address.city,
          State: taxReturn.taxpayer.address.state,
          ZipCode: taxReturn.taxpayer.address.zipCode,
        },
        TaxPayerEmail: taxReturn.taxpayer.email,
        TaxPayerPhone: taxReturn.taxpayer.phone,
        FilingStatus: this.mapFilingStatus(taxReturn.filingStatus),
      },
      ReturnData: {
        Form1040: {
          Income: {
            WagesAmt: taxReturn.income.wages,
            TaxExemptInterestAmt: taxReturn.income.interest || 0,
            OrdinaryDividendsAmt: taxReturn.income.dividends || 0,
            CapitalGainLossAmt: taxReturn.income.capitalGains || 0,
            BusinessIncomeAmt: taxReturn.income.businessIncome || 0,
            OtherIncomeAmt: taxReturn.income.otherIncome || 0,
          },
          AdjustedGrossIncome: {
            StudentLoanInterestDedAmt: taxReturn.deductions.studentLoanInterest || 0,
            IRADeductionAmt: taxReturn.deductions.iraContributions || 0,
          },
          Deductions: {
            StandardDeductionAmt: taxReturn.deductions.standardDeduction,
            ItemizedDeductionsAmt: taxReturn.deductions.itemizedDeductions || 0,
          },
          Credits: {
            ChildTaxCreditAmt: taxReturn.credits.childTaxCredit || 0,
            EarnedIncomeCreditAmt: taxReturn.credits.earnedIncomeCredit || 0,
            EducationCreditAmt: taxReturn.credits.educationCredits || 0,
          },
          Tax: {
            TotalTaxAmt: taxReturn.taxLiability.federalTax,
            TotalWithholdingAmt: taxReturn.taxLiability.totalWithholding,
          },
          Refund: {
            RefundAmt: taxReturn.refund.federalRefund,
            RoutingTransitNumber: taxReturn.refund.directDeposit?.routingNumber,
            BankAccountNumber: taxReturn.refund.directDeposit?.accountNumber,
            BankAccountType: taxReturn.refund.directDeposit?.accountType === "checking" ? "C" : "S",
          },
        },
      },
      ...(taxReturn.spouse && {
        SpouseSSN: taxReturn.spouse.ssn,
        SpouseName: {
          FirstName: taxReturn.spouse.firstName,
          LastName: taxReturn.spouse.lastName,
        },
      }),
    }
  }

  private mapFilingStatus(status: TaxReturn["filingStatus"]): string {
    const statusMap: Record<TaxReturn["filingStatus"], string> = {
      single: "Single",
      married_joint: "MarriedFilingJointly",
      married_separate: "MarriedFilingSeparately",
      head_of_household: "HeadOfHousehold",
    }
    return statusMap[status]
  }

  private mapTaxBanditsStatus(statusCode: number): FilingStatusResponse["status"] {
    if (statusCode === 200) return "accepted"
    if (statusCode === 201) return "submitted"
    if (statusCode === 202) return "processing"
    if (statusCode >= 400) return "rejected"
    return "pending"
  }
}
