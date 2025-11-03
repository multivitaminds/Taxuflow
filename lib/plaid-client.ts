// Plaid integration for payroll connections

interface PlaidConfig {
  clientId: string
  secret: string
  env: "sandbox" | "development" | "production"
}

export class PlaidClient {
  private config: PlaidConfig

  constructor() {
    this.config = {
      clientId: process.env.PLAID_CLIENT_ID || "",
      secret: process.env.PLAID_SECRET || "",
      env: (process.env.PLAID_ENV as "sandbox" | "development" | "production") || "sandbox",
    }
  }

  async createLinkToken(userId: string) {
    const response = await fetch("https://sandbox.plaid.com/link/token/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        secret: this.config.secret,
        user: {
          client_user_id: userId,
        },
        client_name: "Taxu",
        products: ["auth", "transactions", "income", "employment"], // Added employment for payroll data
        country_codes: ["US"],
        language: "en",
        webhook: process.env.NEXT_PUBLIC_APP_URL + "/api/plaid/webhook",
        // Business financial management configuration
        account_filters: {
          depository: {
            account_subtypes: ["checking", "savings"],
          },
        },
      }),
    })

    const data = await response.json()
    return data.link_token
  }

  async exchangePublicToken(publicToken: string) {
    const response = await fetch("https://sandbox.plaid.com/item/public_token/exchange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        secret: this.config.secret,
        public_token: publicToken,
      }),
    })

    const data = await response.json()
    return {
      accessToken: data.access_token,
      itemId: data.item_id,
    }
  }

  async getPayrollData(accessToken: string) {
    const response = await fetch("https://sandbox.plaid.com/income/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        secret: this.config.secret,
        access_token: accessToken,
      }),
    })

    const data = await response.json()
    return data
  }

  async getEmployeeData(accessToken: string) {
    const response = await fetch("https://sandbox.plaid.com/auth/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        secret: this.config.secret,
        access_token: accessToken,
      }),
    })

    const data = await response.json()
    return data
  }
}

export const plaidClient = new PlaidClient()
