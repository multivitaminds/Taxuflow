// TaxBandits Business Tax Filing Provider

import type { BusinessTaxReturn, PayrollTaxReturn, FilingResult } from "../types"

export class TaxBanditsBusinessProvider {
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

  async submitBusinessReturn(businessReturn: BusinessTaxReturn): Promise<FilingResult> {
    if (!this.apiKey || !this.userToken) {
      throw new Error("TaxBandits credentials not configured")
    }

    try {
      const accessToken = await this.getAccessToken()

      // Determine form type based on entity
      const formEndpoint = this.getBusinessFormEndpoint(businessReturn.entityType)
      const payload = this.transformBusinessReturn(businessReturn)

      const response = await fetch(`${this.apiUrl}/${formEndpoint}/Create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.Errors?.[0]?.Message || "Failed to submit business return")
      }

      const result = await response.json()

      return {
        success: result.StatusCode === 200,
        submissionId: result.SubmissionId,
        status: "submitted",
        message: "Business return submitted successfully",
        estimatedProcessingTime: "3-5 business days",
      }
    } catch (error) {
      console.error("[v0] Business filing error:", error)
      return {
        success: false,
        submissionId: "",
        status: "rejected",
        message: error instanceof Error ? error.message : "Failed to submit business return",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      }
    }
  }

  async submitPayrollReturn(payrollReturn: PayrollTaxReturn): Promise<FilingResult> {
    if (!this.apiKey || !this.userToken) {
      throw new Error("TaxBandits credentials not configured")
    }

    try {
      const accessToken = await this.getAccessToken()

      const formEndpoint = this.getPayrollFormEndpoint(payrollReturn.formType)
      const payload = this.transformPayrollReturn(payrollReturn)

      const response = await fetch(`${this.apiUrl}/${formEndpoint}/Create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.Errors?.[0]?.Message || "Failed to submit payroll return")
      }

      const result = await response.json()

      return {
        success: result.StatusCode === 200,
        submissionId: result.SubmissionId,
        status: "submitted",
        message: "Payroll return submitted successfully",
        estimatedProcessingTime: "1-2 business days",
      }
    } catch (error) {
      console.error("[v0] Payroll filing error:", error)
      return {
        success: false,
        submissionId: "",
        status: "rejected",
        message: error instanceof Error ? error.message : "Failed to submit payroll return",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      }
    }
  }

  private getBusinessFormEndpoint(entityType: BusinessTaxReturn["entityType"]): string {
    const endpointMap = {
      c_corp: "Form1120",
      s_corp: "Form1120S",
      partnership: "Form1065",
      llc: "Form1065", // LLCs typically file as partnerships
    }
    return endpointMap[entityType]
  }

  private getPayrollFormEndpoint(formType: PayrollTaxReturn["formType"]): string {
    const endpointMap = {
      "941": "Form941",
      "940": "Form940",
      w2: "FormW2",
      "1099": "Form1099NEC",
    }
    return endpointMap[formType]
  }

  private transformBusinessReturn(businessReturn: BusinessTaxReturn): any {
    return {
      ReturnHeader: {
        TaxYear: businessReturn.taxYear,
        BusinessName: businessReturn.business.name,
        EIN: businessReturn.business.ein,
        BusinessAddress: {
          Address1: businessReturn.business.address.street,
          City: businessReturn.business.address.city,
          State: businessReturn.business.address.state,
          ZipCode: businessReturn.business.address.zipCode,
        },
        Email: businessReturn.business.email,
        Phone: businessReturn.business.phone,
      },
      ReturnData: {
        Income: {
          GrossReceipts: businessReturn.income.grossReceipts,
          Returns: businessReturn.income.returns,
          CostOfGoodsSold: businessReturn.income.costOfGoodsSold,
          OtherIncome: businessReturn.income.otherIncome,
        },
        Deductions: {
          Salaries: businessReturn.deductions.salaries,
          Rent: businessReturn.deductions.rent,
          Taxes: businessReturn.deductions.taxes,
          Interest: businessReturn.deductions.interest,
          Depreciation: businessReturn.deductions.depreciation,
          OtherDeductions: businessReturn.deductions.otherDeductions,
        },
        Tax: {
          TotalTax: businessReturn.taxLiability.totalTax,
          EstimatedPayments: businessReturn.taxLiability.estimatedPayments,
        },
      },
    }
  }

  private transformPayrollReturn(payrollReturn: PayrollTaxReturn): any {
    if (payrollReturn.formType === "941") {
      return {
        ReturnHeader: {
          TaxYear: payrollReturn.taxYear,
          Quarter: `Q${payrollReturn.quarter}`,
          BusinessName: payrollReturn.business.name,
          EIN: payrollReturn.business.ein,
          BusinessAddress: {
            Address1: payrollReturn.business.address.street,
            City: payrollReturn.business.address.city,
            State: payrollReturn.business.address.state,
            ZipCode: payrollReturn.business.address.zipCode,
          },
        },
        ReturnData: {
          Employees: payrollReturn.employees?.map((emp) => ({
            FirstName: emp.firstName,
            LastName: emp.lastName,
            SSN: emp.ssn,
            Wages: emp.wages,
            FederalWithholding: emp.federalWithholding,
            SocialSecurityWithholding: emp.socialSecurityWithholding,
            MedicareWithholding: emp.medicareWithholding,
          })),
          Totals: {
            TotalWages: payrollReturn.totals.totalWages,
            TotalFederalWithholding: payrollReturn.totals.totalFederalWithholding,
            TotalSocialSecurity: payrollReturn.totals.totalSocialSecurity,
            TotalMedicare: payrollReturn.totals.totalMedicare,
          },
        },
      }
    }

    if (payrollReturn.formType === "1099") {
      return {
        ReturnHeader: {
          TaxYear: payrollReturn.taxYear,
          BusinessName: payrollReturn.business.name,
          EIN: payrollReturn.business.ein,
          BusinessAddress: {
            Address1: payrollReturn.business.address.street,
            City: payrollReturn.business.address.city,
            State: payrollReturn.business.address.state,
            ZipCode: payrollReturn.business.address.zipCode,
          },
        },
        ReturnData: {
          Contractors: payrollReturn.contractors?.map((contractor) => ({
            FirstName: contractor.firstName,
            LastName: contractor.lastName,
            SSN: contractor.ssn,
            EIN: contractor.ein,
            Payments: contractor.payments,
            Address: {
              Address1: contractor.address.street,
              City: contractor.address.city,
              State: contractor.address.state,
              ZipCode: contractor.address.zipCode,
            },
          })),
        },
      }
    }

    return {}
  }
}
